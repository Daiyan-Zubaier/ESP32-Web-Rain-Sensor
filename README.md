# ESP32 Rain Status 🌧️

Live-updating rain-sensor dashboard powered by an **ESP32 + FreeRTOS** back-end and a **React / Vite / Tailwind** front-end.  
Shows current moisture %, a liquid-fill gauge, and a rolling spark-line — refreshed every 5 s.

---

## 1  Hardware

| Part | Notes |
|------|-------|
| **ESP32 DevKit-C** | Any ESP32-WROOM / WROVER board |
| **MH-RD (YL-83) rain-sensor kit** | Detector plate + LM393 board |
| 3 × Dupont jumpers | VCC → 3 V3 · GND → GND · AO → GPIO 34 |
| *optional* Raspberry Pi / always-on PC | Runs **cloudflared** for a permanent public URL |

---

## 2  Firmware (ESP-IDF v5+)

```bash
idf.py set-target esp32
idf.py menuconfig                 # Component → HTTP Server → Max header = 4096
idf.py build flash monitor
```

* REST endpoint `GET /api/rain → {"rain": 83.1}`  
  (CORS header `Access-Control-Allow-Origin: *`)

---

## 3  Making the ESP32 public

### Quick Tunnel (instant URL)

```bash
cloudflared tunnel --url http://192.168.2.211:80
# prints e.g. https://happy-fox-abcd1234.trycloudflare.com
```

Use that address during prototyping.

### Named Tunnel (stable URL)

```bash
cloudflared tunnel login             # one-time auth
cloudflared tunnel create rain-tunnel
cloudflared tunnel run rain-tunnel   # URL: https://<UUID>.cfargotunnel.com
```

---

## 4  Front-end (React / Vite)

### Tech stack
* React 18 + Vite  
* Tailwind CSS 3  
* Framer Motion animations  
* Recharts spark-line  

### Dev proxy & env vars

* **Dev** (`npm run dev`) → Vite proxies `/api/*` to the tunnel host.  
* **Prod** (Vercel) → set `VITE_API_BASE` in project settings.

```bash
# .env  (optional for local dev)
VITE_API_BASE=https://happy-fox-abcd1234.trycloudflare.com
```

```bash
cd rain-ui
npm install
npm run dev          # http://localhost:8080
```

---

## 5  Deploy to Vercel 🚀

1. Push **rain-ui/** to GitHub.  
2. **Vercel → New Project → Import Repo**.  
3. **Settings → Environment Variables**  
   * `VITE_API_BASE = https://<your-tunnel>`  
4. Click **Deploy** → site lives at  
   `https://<project>.vercel.app`

---

## 6  Features

* Live liquid-fill gauge with smooth animation  
* Rolling spark-line (last 10 readings)  
* Auto-refresh every 5 s; mock fallback after 3 failures  
* Dark / light toggle (Tailwind `dark` mode)  
* Responsive 320 px → 1440 px  
* Zero back-end in production — front-end fetches the ESP32 directly

