import Comments from '@/components/comments';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata(
  '/journal',
  '從 Microduck 到 Open Duck Mini v2：建造日誌',
  '從起源、試印與舵機驗收，到薄板裝反、一體件改版及雙腿懸空步態測試，保留真實建造過程與待確認事項。',
);
export const dynamic = 'force-static';

export default function Journal() {
  return (
    <main id="content">
      <header className="page-intro">
        <p className="eyebrow">THE STORY / FROM CURIOSITY TO PARTS</p>
        <h1>本來只是看到一隻小鴨。</h1>
        <p>
          後來，桌上多了舵機、列印件、銅螺母，也多了一份想讓別人接著做的紀錄。
        </p>
      </header>
      <div className="timeline">
        <article className="entry" id="origin">
          <div className="entry-date">
            01 / 起點
            <br />
            2026.08
          </div>
          <div>
            <span className="badge">建造者回述</span>
            <h2>從 Microduck，找到自己動手的路</h2>
            <p>
              一開始，我們是在{' '}
              <a
                className="textlink"
                href="https://pollen-robotics.com/microduck/"
              >
                Pollen Robotics 的 Microduck 頁面
              </a>
              看到這隻小機器人。它讓人想繼續看下去，也讓我們開始想：如果不只看它動，而是親手做一隻，會是什麼樣子？
            </p>
            <p>
              於是，我們循著作者與開源作品的線索往回找，找到了{' '}
              <a
                className="textlink"
                href="https://github.com/apirrone/Open_Duck_Mini"
              >
                apirrone／Open Duck Mini
              </a>
              。打開專案，裡面不只有影片，還有
              CAD、可以列印的零件、材料清單和組裝文件。那個原本有點遙遠的念頭，開始變成一件可以拆成步驟來做的事。
            </p>
            <p>
              最後，我們選擇從 Open Duck Mini v2
              開始：研究零件、整理採購清單，再用自己的 3D
              印表機，一件一件把它做出來。這也是網站叫做 microduck，而實作內容是
              Open Duck Mini v2 的原因。
            </p>
            <div className="notice">
              Microduck 是這次計畫的起點；Open Duck Mini v2
              是我們實際採用的建造版本。兩者的機構、BOM
              與控制設定應各自核對，不能因名稱相近就混用。
            </div>
            <p className="meta">
              這段起源依建造者的回述整理；專案資料分別連回 Pollen 官方頁與 Open
              Duck Mini 作者的儲存庫。
            </p>
          </div>
        </article>
        <article className="entry" id="prepare">
          <div className="entry-date">
            02 / 準備
            <br />
            2026.08.27
          </div>
          <div>
            <span className="badge">路線確定</span>
            <h2>先把「要做哪一隻」搞清楚</h2>
            <p>
              同樣叫小鴨，不同教學使用的舵機、電壓和機構卻不一定相同。我們先把實作路線定在
              Open Duck Mini v2，採用 7.4V
              舵機與相應的電源配置，再整理列印件及五金。
            </p>
            <p>
              這一步沒有讓機器人立刻動起來，卻避免後面把不同版本的零件拼在一起。材料清單先看規格，價格與店家則留給採購當下重新確認。
            </p>
            <a className="textlink" href="/guide#prepare">
              查看這次使用的材料路線 →
            </a>
          </div>
        </article>
        <article className="entry" id="testprint">
          <div className="entry-date">
            03 / 試配
            <br />
            2026.09.04
          </div>
          <div>
            <span className="badge">現場試配</span>
            <h2>第一批，只印三個小零件</h2>
            <p>
              我們沒有一開始就印完整台。批次 0 先挑 leg_spacer、roll_motor_top
              和
              roll_motor_bottom，拿它們驗證最容易讓後面卡關的配合：熱熔嵌件能不能固定、軸承內圈能不能套上凸軸。
            </p>
            <p>
              試配結果通過。但這只代表那幾個接合已確認，不能順手把髖座所有孔位或整條腿都算作完成。這個區分，後來也成為
              checklist 的原則。
            </p>
            <p>
              spacer 有兩個小孔貫穿兩側，每端各放一顆 M3 嵌件，共四顆；比較大的
              Ø6 孔用途不同，不要看到孔就壓入銅螺母。
            </p>
          </div>
        </article>
        <article className="entry" id="servo">
          <div className="entry-date">
            04 / 驗收
            <br />
            2026.09.06—07
          </div>
          <div>
            <span className="badge">電性／位置已測</span>
            <h2>十五顆舵機，逐顆留下數字</h2>
            <p>
              舵機到貨後，我們逐顆量測並記錄。15 顆的電性與位置測試通過，其中 14
              顆完成 ID 與舵盤安裝；另一顆留下當備品。
            </p>
            <p>
              裝盤後，ID 24 與 ID 31
              曾因中心螺絲過緊出現電流尖峰。調整螺絲、重新測試後，問題才算有依據地排除。ID
              10 沒有轉動受阻，早先不正確的紀錄也已修正。
            </p>
            <p>
              整理時還發現另一件事：有些「沒有異音」是根據沒收到異常回報推定的。我們把第
              3–15
              顆的人耳確認重新標成待確認。沒有被證實的好消息，也不應當作已完成。
            </p>
            <a className="textlink" href="/downloads/servo-acceptance-log.md">
              下載原始量測紀錄 →
            </a>
          </div>
        </article>
        <article className="entry" id="mistake">
          <div className="entry-date">
            05 / 裝錯一次
            <br />
            2026.09.08
          </div>
          <div>
            <span className="badge pending">損壞原因待釐清</span>
            <h2>看起來相似，不代表可以互換</h2>
            <p>
              到了右小腿組裝，問題發生在兩片薄板。大腿和小腿確實共用同一組零件規格，但一組裡的
              left_sheet 與 right_sheet
              是不同零件，而且有方向性。裝錯位置，就會接不上。
            </p>
            <p>
              重新拆裝時，零件出了狀況。照片中，spacer
              的一個孔裡沒有了銅嵌件，薄板上則留著一顆外露的嵌件，符合嵌件被螺絲一起帶出的情況。照片不足以判定是孔徑、熱熔深度或拆卸受力造成；也不能據此判斷舵機損壞。
            </p>
            <p>
              我們先把 spacer
              列為待更換，再回頭修正說明：不能只寫「兩片薄板」，要讓下一個人知道，它們是有左右與正反之別的一對。
            </p>
          </div>
        </article>
        <article className="entry" id="unibody">
          <div className="entry-date">
            06 / 換個做法
            <br />
            2026.09.08
          </div>
          <div>
            <span className="badge cad">CAD 驗證，未試裝</span>
            <h2>既然最後是一個總成，能不能一起印？</h2>
            <p>
              拆裝之後，我們提出一個很直接的問題：兩片薄板與 spacer
              最後都要固定在一起，走線看起來也有空間，那就先試著把三件合起來看看。
            </p>
            <img
              className="wide-img"
              src="/assets/shin-v2.png"
              alt="補滿中央固定孔後的一體式小腿框架，兩個觀看方向"
              width="2210"
              height="1190"
              loading="lazy"
            />
            <h3>v1：先讓三件真正連在一起</h3>
            <p>
              依右小腿的 URDF 裝配位置放好兩款薄板與 spacer。原 CAD
              接合處留有細小間隙，因此將 spacer 兩端各延伸 0.25
              mm，再做布林聯集。輸出的 STL 是一個封閉、連通的實體。
            </p>
            <h3>v2：把不需要的中間固定孔補滿</h3>
            <p>
              一體後，中央連接薄板與 spacer
              的螺絲孔、嵌件孔及外側沉孔已不再用於組裝。我們把它們補成實心，保留兩端舵機孔及側向開口，外形尺寸約
              30.70 × 70.65 × 44.85 mm。
            </p>
            <div className="notice">
              <strong>到這裡，我們確認的是模型。</strong>
              <br />
              單一封閉實體不等於已通過實物裝配。舵機裝入路徑、工具空間、列印方向與強度，仍待下一輪試作驗證。
            </div>
            <div className="actions">
              <a className="button primary" href="/downloads#models">
                下載兩版 STL
              </a>
              <a className="button" href="/guide#rebuild">
                用程式重現改版
              </a>
            </div>
          </div>
        </article>
        <article className="entry" id="right-leg-test">
          <div className="entry-date">
            07 / 終於動了
            <br />
            2026.09.09
          </div>
          <div>
            <span className="badge">低速手動觀察正常</span>
            <h2>先讓一個關節動，再把控制交到手上</h2>
            <p>
              右腿裝好後，我們先用電供做小幅度測試。右踝從 1.27° 移到
              3.21°，再回到起點。幅度太小，看不太出來，於是加到約
              6°來回。前兩次完成，第三次卻讀到
              6.5V，程式因此停止並釋放扭力。這筆低電壓紀錄也保留下來，原因尚未確定。
            </p>
            <p>
              接著，我們做了本機控制台，先顯示五顆舵機的角度、電壓與溫度，再選一個關節調整。±
              按鈕點一下直接移動
              2°；按住持續低速移動，放開停止並釋放扭力，每次按住最多
              10°。按住訊號中斷 0.6 秒也會停止。控制仍在現場本機執行。
            </p>
            <p>
              現場操作後，建造者回報沒有異音、看起來正常。我們把這一步記為「右腿低速手動觀察正常」，還沒有完成承重、疲勞或步行驗證；也不能由此推定每個一體件版本都已完成試裝。
            </p>
            <h3>要繼續印之前，先重新點一次零件</h3>
            <p>
              桌上還有一件 roll_motor_bottom、兩件
              roll_motor_top。左腿可以各取一件，另外一件 top
              留作備品。兩組薄板加 spacer 則全部改為 v2
              一體框架，左大腿與左小腿各印一件。
            </p>
            <p>
              更新後剩 31
              件，每個需要重複的模型都拆成獨立檔案，避免漏印或多印。這份清單記錄我們此刻的進度，也讓下一位建造者能看清楚：哪些是改版替換，哪些只是已經有庫存。
            </p>
            <a className="textlink" href="/downloads#remaining-print">
              查看續印包與替換說明 →
            </a>
          </div>
        </article>
        <article className="entry" id="suspended-gait-test">
          <div className="entry-date">
            08 / 雙腿聯動
            <br />
            2026.09.11
          </div>
          <div>
            <span className="badge">懸空動作已測</span>
            <h2>先不承重，把一個步態循環走完</h2>
            <p>
              雙腿完成後，我們先把機器人懸空，從小幅度開始確認各關節方向與左右腿配合。修正一條腿的安裝方向後，再讓雙腿所有關節一起動作。
            </p>
            <iframe
              className="replay-frame"
              src="/gait-replay.html"
              title="影片、馬達資料與 3D 模型同步回放"
              loading="lazy"
              allowFullScreen
            />
            <p>
              這段測試採低速、小角度的相對動作；現場確認沒有碰撞或異音。流程結束後，控制程式回到起始姿勢並釋放舵機扭力。
            </p>
            <div className="notice">
              <strong>驗證範圍：</strong>
              目前只確認懸空時能完成步態姿勢與轉向序列。影片不代表已通過落地承重、平衡或自主行走測試。
            </div>
            <div className="actions">
              <a className="button primary" href="/gait-replay.html">
                全螢幕同步回放
              </a>
              <a
                className="button"
                href="/media/microduck-suspended-gait-demo-2026-09-11.mp4"
                download
              >
                下載示範影片
              </a>
              <a className="button" href="/assembly">
                查看組裝與走線
              </a>
            </div>
          </div>
        </article>
      </div>
      <Comments thread="journal" />
    </main>
  );
}
