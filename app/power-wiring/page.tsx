import {pageMetadata} from '@/lib/seo';

export const metadata=pageMetadata('/power-wiring','2S 電池與舵機板接線圖','Open Duck Mini v2 的 2S 18650、BMS、保險絲、開關、DC 插頭、Waveshare Bus Servo Adapter 與 Raspberry Pi 接線示意。');

const Box=({x,y,w,h,title,lines=[],tone='plain'}:{x:number;y:number;w:number;h:number;title:string;lines?:string[];tone?:string})=><g className={`wire-box ${tone}`}><rect x={x} y={y} width={w} height={h} rx="10"/><text x={x+w/2} y={y+30} textAnchor="middle" className="wire-title">{title}</text>{lines.map((line,i)=><text key={line} x={x+w/2} y={y+54+i*20} textAnchor="middle" className="wire-note">{line}</text>)}</g>;

export default function PowerWiring(){return <main id="content">
  <section className="page-intro"><p className="eyebrow">POWER / 2S BATTERY WIRING</p><h1>電池供電接線示意圖</h1><p>適用於本次 Open Duck Mini v2：兩顆高放電 18650、2S BMS、7.4V STS3215 舵機與 Waveshare Bus Servo Adapter (A)。先斷電完成接線，再依量測點逐段確認。</p></section>
  <section className="section wiring-lead"><div className="power-state"><strong>目標輸出</strong><span>標稱 7.4V</span><small>充飽最高 8.4V</small></div><div className="power-state"><strong>DC 插頭</strong><span>5.5 × 2.1 mm</span><small>中心正極</small></div><div className="power-state danger"><strong>禁止</strong><span>9V／12V／3S</span><small>轉接板不會降壓</small></div></section>
  <section className="section"><div className="section-heading"><div><p className="eyebrow">01 / CELLS → BMS</p><h2>兩顆電池串聯，三個節點接進 BMS</h2></div><span className="badge pending">全程斷電接線</span></div>
    <div className="diagram-scroll"><svg className="wiring-svg" viewBox="0 0 1160 500" role="img" aria-labelledby="cells-title cells-desc"><title id="cells-title">兩顆 18650 串聯至 2S BMS</title><desc id="cells-desc">第一顆電池負極接 BMS B負，兩顆電池中點接 B1或BM，第二顆電池正極接 B正。</desc>
      <defs><marker id="arrow-red" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#bd312c"/></marker><marker id="arrow-black" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#27383b"/></marker></defs>
      <Box x={35} y={125} w={220} h={115} title="18650 #1" lines={['3.0–4.2V','下方電芯']} tone="cell"/><text x="55" y="113" className="polarity minus">−</text><text x="232" y="113" className="polarity plus">＋</text>
      <Box x={35} y={310} w={220} h={115} title="18650 #2" lines={['3.0–4.2V','上方電芯']} tone="cell"/><text x="55" y="298" className="polarity minus">−</text><text x="232" y="298" className="polarity plus">＋</text>
      <Box x={770} y={110} w={340} h={325} title="2S BMS" lines={['保護／均衡板']} tone="board"/>
      <g className="terminal"><circle cx="805" cy="205" r="24"/><text x="805" y="212" textAnchor="middle">B−</text><circle cx="805" cy="280" r="24"/><text x="805" y="287" textAnchor="middle">B1</text><circle cx="805" cy="355" r="24"/><text x="805" y="362" textAnchor="middle">B+</text></g>
      <path className="wire black" d="M55 125V80H700V205H775" markerEnd="url(#arrow-black)"/><path className="wire red" d="M232 240V275H350V310H55"/><circle cx="350" cy="275" r="9" className="junction"/><path className="wire mid" d="M350 275H775" markerEnd="url(#arrow-black)"/><path className="wire red" d="M232 425V460H700V355H775" markerEnd="url(#arrow-red)"/>
      <text x="450" y="260" className="line-label">兩顆電池中點 → B1／BM</text><text x="410" y="65" className="line-label">總負極 → B−</text><text x="415" y="485" className="line-label red-text">總正極 → B＋</text>
    </svg></div>
    <div className="notice"><strong>BMS 標示可能不同：</strong>中點可能寫成 <code>B1</code>、<code>BM</code> 或 <code>B1/B2</code>。若你的板子不是 <code>B− / B1 / B+ / P− / P+</code>，先依實板資料確認，不能按端子位置猜。</div>
  </section>
  <section className="section"><div className="section-heading"><div><p className="eyebrow">02 / BMS → SERVO BUS</p><h2>負載端經保險絲與開關，送進 DC 插孔</h2></div><span className="badge cad">紅正／黑負</span></div>
    <div className="diagram-scroll"><svg className="wiring-svg load" viewBox="0 0 1320 500" role="img" aria-labelledby="load-title load-desc"><title id="load-title">BMS 負載端到舵機轉接板</title><desc id="load-desc">BMS P正經五安培保險絲和開關接 DC 插頭中心，P負接 DC 插頭外圈，再送入 Waveshare 舵機轉接板。</desc>
      <Box x={25} y={130} w={225} h={225} title="2S BMS" lines={['P＋ / P−','負載輸出']} tone="board"/><Box x={330} y={105} w={170} h={90} title="5A 保險絲" lines={['靠近電池']}/><Box x={575} y={105} w={170} h={90} title="主電源開關" lines={['切斷正極']}/><Box x={820} y={100} w={175} h={230} title="DC 插頭" lines={['5.5 × 2.1 mm','中心 ＋','外圈 −']} tone="connector"/><Box x={1070} y={90} w={225} h={260} title="Waveshare" lines={['Bus Servo Adapter (A)','跳帽 B：USB 控制','輸出＝輸入電壓']} tone="board"/>
      <circle cx="220" cy="165" r="18" className="plus-node"/><text x="220" y="171" textAnchor="middle">＋</text><circle cx="220" cy="315" r="18" className="minus-node"/><text x="220" y="321" textAnchor="middle">−</text>
      <path className="wire red" d="M238 165H330"/><path className="wire red" d="M500 150H575"/><path className="wire red" d="M745 150H820"/><path className="wire red" d="M995 150H1070"/><path className="wire black" d="M238 315H820"/><path className="wire black" d="M995 285H1070"/>
      <text x="355" y="235" className="line-label red-text">P＋ → 保險絲 → 開關 → 中心正極</text><text x="430" y="350" className="line-label">P− → 外圈負極</text>
      <Box x={1070} y={395} w={225} h={75} title="STS3215 舵機鏈" lines={['14 顆 · 7.4V 系列']} tone="servo"/><path className="wire bus" d="M1182 350V395"/>
    </svg></div>
  </section>
  <section className="section"><div className="section-heading"><div><p className="eyebrow">03 / CONTROL</p><h2>Pi 獨立供應 5V，USB 負責通訊</h2></div></div>
    <div className="control-grid"><div className="control-card"><strong>Raspberry Pi</strong><span>獨立穩定 5V</span><small>不要從 7.4V 舵機匯流排直接供電</small></div><div className="control-arrow">USB Type-C<br/><small>資料＋訊號地</small></div><div className="control-card"><strong>Bus Servo Adapter (A)</strong><span>跳帽設為 B</span><small>USB 控制模式</small></div><div className="control-arrow">D / V / G</div><div className="control-card"><strong>STS3215 鏈</strong><span>訊號／7.4V／GND</span><small>插頭方向逐顆核對</small></div></div>
  </section>
  <section className="section"><p className="eyebrow">METER CHECKPOINTS</p><h2>接上舵機板前，先量三次</h2><div className="meter-grid"><article><span>①</span><h3>B− → B1／BM</h3><strong>3.0–4.2V</strong><p>第一顆電芯電壓。</p></article><article><span>②</span><h3>B1／BM → B＋</h3><strong>3.0–4.2V</strong><p>第二顆電芯電壓。</p></article><article><span>③</span><h3>P− → P＋</h3><strong>6.0–8.4V</strong><p>BMS 負載端總電壓。</p></article></div><div className="notice danger-note"><strong>任一讀值不符就停止：</strong>不要接上 DC 插頭，也不要用 9V、12V 或 3S 電池測試。首次上電時固定機器人、保持舵機扭力關閉，再確認 14 顆舵機是否上線。</div></section>
</main>}
