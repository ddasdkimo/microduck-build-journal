export interface Env {
  ASSETS: Fetcher;
  COMMENTS_DB: D1Database;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET: string;
  COMMENTS_ADMIN_TOKEN: string;
  COMMENTS_HASH_SECRET: string;
}
export const THREADS = new Set(['articles/leg-sheet-direction','articles/spacer-inserts','articles/one-piece-shin','journal','downloads']);
const ORIGIN='https://microduck.intemotech.com';
function json(data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
class BadRequest extends Error { constructor(message:string,public status=400){super(message)} }
export async function bodyJSON(req:Request){
 if(!req.headers.get('content-type')?.startsWith('application/json'))throw new BadRequest('請使用 JSON 格式。',415);
 const reader=req.body?.getReader();if(!reader)throw new BadRequest('留言內容不能空白。');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>12000){await reader.cancel();throw new BadRequest('內容太長。',413)}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}
 try{return JSON.parse(new TextDecoder().decode(bytes))}catch{throw new BadRequest('內容格式錯誤。')}
}
export function validate(d:Record<string,unknown>){
 if(!d||typeof d!=='object'||typeof d.thread!=='string'||!THREADS.has(d.thread))throw new BadRequest('找不到討論主題。');
 if(typeof d.body!=='string'||!d.body.trim()||d.body.trim().length>2000)throw new BadRequest('留言需為 1–2000 字。');
 if(d.nickname!==undefined&&typeof d.nickname!=='string')throw new BadRequest('暱稱格式錯誤。');
 const nickname=(typeof d.nickname==='string'?d.nickname.trim():'')||'匿名';if(nickname.length>40)throw new BadRequest('暱稱最多 40 字。');
 if(typeof d.requestId!=='string'||!/^\w{8}-\w{4}-4\w{3}-[89ab]\w{3}-\w{12}$/i.test(d.requestId))throw new BadRequest('請重新載入留言表單。');
 if(typeof d.token!=='string'||d.token.length<1||d.token.length>2048)throw new BadRequest('請完成防垃圾留言驗證。');
 return {thread:d.thread,body:d.body.trim(),nickname,requestId:d.requestId,token:d.token};
}
async function digest(s:string){return new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))}
async function authorized(req:Request,env:Env){
 if(!env.COMMENTS_ADMIN_TOKEN)return false;
 const a=await digest(req.headers.get('Authorization')||'');const b=await digest('Bearer '+env.COMMENTS_ADMIN_TOKEN);
 let different=0;for(let i=0;i<a.length;i++)different|=a[i]^b[i];return different===0;
}
async function senderHash(ip:string,env:Env,now:number){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.COMMENTS_HASH_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const value=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(Math.floor(now/86400)+':'+ip));
 return Array.from(new Uint8Array(value),b=>b.toString(16).padStart(2,'0')).join('');
}
export async function handle(req:Request,env:Env,verifyFetch:typeof fetch=fetch):Promise<Response>{
 const u=new URL(req.url),path=u.pathname;
 try{
  if(path==='/api/comments/config')return json({enabled:!!(env.COMMENTS_DB&&env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET&&env.COMMENTS_HASH_SECRET),siteKey:env.TURNSTILE_SITE_KEY||''});
  if(!env.COMMENTS_DB)return json({error:'留言服務尚未啟用，請稍後再試。'},503);
  if(path==='/api/comments'&&req.method==='GET'){
   const thread=u.searchParams.get('thread')||'';if(!THREADS.has(thread))throw new BadRequest('找不到討論主題。');
   const before=Number(u.searchParams.get('before')||Number.MAX_SAFE_INTEGER);if(!Number.isSafeInteger(before)||before<1)throw new BadRequest('分頁格式錯誤。');
   const {results}=await env.COMMENTS_DB.prepare("SELECT id,nickname,body,created_at FROM comments WHERE thread=? AND status='approved' AND id<? ORDER BY id DESC LIMIT 21").bind(thread,before).all();
   const rows=results.slice(0,20);return json({comments:rows,next:results.length>20?rows[19].id:null});
  }
  if(path==='/api/comments'&&req.method==='POST'){
   if(req.headers.get('Origin')!==u.origin||u.origin!==ORIGIN&&u.hostname!=='localhost'&&u.hostname!=='127.0.0.1')throw new BadRequest('請從本站留言。',403);
   const d=validate(await bodyJSON(req));
   if(!env.TURNSTILE_SECRET||!env.COMMENTS_HASH_SECRET)throw new BadRequest('留言服務尚未啟用。',503);
   // An opaque UUID makes network retries safe, even after a Turnstile token was consumed.
   const previous=await env.COMMENTS_DB.prepare('SELECT id FROM comments WHERE request_id=?').bind(d.requestId).first();
   if(previous)return json({ok:true,message:'已收到留言，審核後會公開。'},202);
   const ip=req.headers.get('CF-Connecting-IP');if(!ip)throw new BadRequest('無法驗證連線，請稍後再試。',503);
   const now=Math.floor(Date.now()/1000),hash=await senderHash(ip,env,now);
   const check=await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:d.token,remoteip:ip}),signal:AbortSignal.timeout(8000)});
   if(!check.ok)throw new BadRequest('驗證服務暫時無法使用，請稍後再試。',503);
   const v=await check.json() as {success?:boolean,hostname?:string,action?:string};
   if(!v.success||v.hostname!==u.hostname||v.action!=='comment')throw new BadRequest('驗證已過期或未通過，請再試一次。',403);
   // One atomic conditional INSERT prevents concurrent requests from bypassing limits.
   const inserted=await env.COMMENTS_DB.prepare(`INSERT INTO comments(request_id,thread,nickname,body,created_at,sender_hash)
    SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM comments WHERE sender_hash=? AND created_at>?)
    AND (SELECT COUNT(*) FROM comments WHERE sender_hash=? AND created_at>=?)<10
    ON CONFLICT(request_id) DO NOTHING RETURNING id`).bind(d.requestId,d.thread,d.nickname,d.body,now,hash,hash,now-60,hash,now-86400).first();
   if(!inserted){const retry=await env.COMMENTS_DB.prepare('SELECT id FROM comments WHERE request_id=?').bind(d.requestId).first();if(!retry)throw new BadRequest('留言太頻繁，請稍後再試（每分鐘一則、每天最多十則）。',429)}
   await env.COMMENTS_DB.prepare('UPDATE comments SET sender_hash=NULL WHERE sender_hash IS NOT NULL AND created_at<?').bind(now-86400).run();
   return json({ok:true,message:'已收到留言，審核後會公開。'},202);
  }
  if(path.startsWith('/api/moderation')){
   if(!await authorized(req,env))return json({error:'管理金鑰不正確。'},401);
   if(path==='/api/moderation'&&req.method==='GET'){
    const status=u.searchParams.get('status')||'pending';if(!['pending','approved','hidden'].includes(status))throw new BadRequest('狀態錯誤。');
    const before=Number(u.searchParams.get('before')||Number.MAX_SAFE_INTEGER);if(!Number.isSafeInteger(before)||before<1)throw new BadRequest('分頁錯誤。');
    const {results}=await env.COMMENTS_DB.prepare('SELECT id,thread,nickname,body,status,created_at FROM comments WHERE status=? AND id<? ORDER BY id DESC LIMIT 51').bind(status,before).all();
    return json({comments:results.slice(0,50),next:results.length>50?results[49].id:null});
   }
   if(path==='/api/moderation'&&req.method==='POST'){
    if(req.headers.get('Origin')!==u.origin)throw new BadRequest('來源錯誤。',403);
    const d=await bodyJSON(req);if(!Number.isSafeInteger(d?.id)||d.id<1||!['approve','hide'].includes(d.action))throw new BadRequest('操作格式錯誤。');
    const result=await env.COMMENTS_DB.prepare('UPDATE comments SET status=?,moderated_at=? WHERE id=? RETURNING id').bind(d.action==='approve'?'approved':'hidden',Math.floor(Date.now()/1000),d.id).first();
    if(!result)throw new BadRequest('留言不存在。',404);return json({ok:true});
   }
  }
  return json({error:'找不到此操作。'},404);
 }catch(e){if(e instanceof BadRequest)return json({error:e.message},e.status);return json({error:'留言服務暫時無法使用，內容已保留在表單，請稍後重試。'},503)}
}
export default {async fetch(req:Request,env:Env){if(new URL(req.url).pathname.startsWith('/api/'))return handle(req,env);return env.ASSETS.fetch(req)}};
