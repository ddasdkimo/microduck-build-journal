import type { Metadata } from 'next';

import './globals.css';
export const metadata: Metadata = {title:{default:'小鴨製造所｜Open Duck Mini v2 建造筆記',template:'%s｜小鴨製造所'},description:'從零件試配、舵機驗收到一體式小腿改版，記錄 Open Duck Mini v2 的建造過程，分享 CAD 爆炸圖、列印檔與重現步驟。'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-Hant"><body><a className="skip" href="#content">跳至內容</a><header className="site-header"><a href="/" className="brand"><span className="brand-mark">D.</span><span>小鴨製造所<small>OPEN DUCK / BUILD NOTES</small></span></a><nav aria-label="主導覽"><a href="/guide">重現指南</a><a href="/journal">建造日誌</a><a href="/downloads">圖面與下載</a><a href="/sources">來源</a></nav></header>{children}<footer className="site-footer"><div><strong>小鴨製造所</strong><p>把做過的、做錯的，以及還沒驗證的，都留下來。</p></div><div><p>非官方建造紀錄 · Open Duck Mini v2</p><p>紀錄更新 2026.09.08 · <a href="/sources">來源與授權</a></p></div></footer></body></html>}
