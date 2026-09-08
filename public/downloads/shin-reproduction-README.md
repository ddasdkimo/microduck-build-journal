# 小腿一體件重現包

上游：apirrone/Open_Duck_Mini，commit b23317a485b3cec7d8417f352478778b3475173c。
本包僅含右小腿所需三個 CAD 網格、URDF、重建程式與 Apache-2.0 授權。CAD 網格單位為公尺，腳本依 URDF 裝配後轉為毫米；不可再額外乘 1000。

修改日期 2026-09-08：v1 合併兩片薄板＋spacer，spacer 兩端各延伸 0.25mm；v2 補滿中央固定孔與沉孔。兩版均未完成實物裝入與列印驗證。

## 重建（Python 3.11）

```sh
python3.11 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python sim/print/build_shin_unibody.py
.venv/bin/python sim/print/build_shin_unibody_filled.py
```

輸出位於 designs/right-shin-unibody-v1 與 v2。STL、PNG 與 geometry-check.json 一起生成。圖形字型只影響圖片外觀，不影響 STL。

build_assembly_data.py 在本包中僅提供 tf、ROOT、SOURCE，不能單独執行完整全機生成（其餘全機網格請從上游取得）。
