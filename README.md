# 小鴨製造所 / microduck-build-journal

公開建造日誌與重現指南。實作為 Open Duck Mini v2，起源故事來自建造者看到 Pollen Robotics Microduck 後循開源線索找到本專案。

## 本地與部署

```sh
npm ci
npm run dev
npm run build
npm run deploy
```

靜態輸出 `dist/client`，Cloudflare Workers Static Assets；網域 `microduck.intemotech.com`。需要自己的 Cloudflare 登入與網域存取權。帳號與授權值不寫入 repository。

公開資產已包含在 public；獨立 clone 不需要私人專案。`scripts/prepare_assets.py` 只供本地維護者從同層私人原始專案重新匯出 allowlist，CI 不執行此步驟。

## 維護

- 網站：app/ 下五個頁面與 globals.css。
- 讀者清單：scripts/reader-checklist.json，初始狀態全為未完成。
- 修改 STL 來源以硬體 fork 為主，未來以 Release 連結取代網站內快照；請連同 README、授權、geometry-check 一起保留。
- 每次新增日誌寫清楚日期、實測／CAD／待確認，不能把幾何驗證當成實物驗收。
- 不放入私人照片、連線位址、憑證、完整對話。

## Repo 分工建議

1. fork apirrone/Open_Duck_Mini 的 v2，維護硬體改版與重建程式；保留 upstream。
2. 本站單獨一個 microduck-build-journal repo，獨立版本與發布。
3. 硬體 Release 綁定修改來源 commit，網站文章連到該 Release。
4. 留言未啟用。可用 giscus 接公開 GitHub Discussions，或日後建置受控留言服務；目前沒有表單收集訪客資料。

## 上游

https://github.com/apirrone/Open_Duck_Mini
CAD 基準 b23317a485b3cec7d8417f352478778b3475173c。下載包保留 Apache-2.0。網站為非官方紀錄。

## 靜態導覽

站內頁面使用原生 `<a href>`，不要換成 `next/link`。目前 vinext 靜態輸出的 Link 切頁／prefetch 會拋出 TypeError 並攔截導覽。2026-09-08 已在正式站實際點擊首頁兩個 CTA，確認 /guide 與 /downloads 正常載入。
