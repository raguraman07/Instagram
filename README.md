# Instagram Webpage - Auto Cloudflare Tunnel Server

Running `python app.py` (or double-clicking `start.bat`) automatically starts the Flask server, creates a Cloudflare Quick Tunnel, and outputs **ONLY** the live public Cloudflare URL.

> [!NOTE]
> All login forms and interactive elements are for **frontend demonstration purposes only**. No credentials or user data are collected, saved, or transmitted.

---

## Quick Usage

Run:
```powershell
python app.py
```

### Output:
```text
https://xxx-xxx-xxx.trycloudflare.com
```

---

## How It Works

1. Starts the Flask server silently in the background (`http://127.0.0.1:5000`).
2. Checks for `cloudflared`. If missing on Windows, it automatically downloads `cloudflared.exe`.
3. Launches Cloudflare Quick Tunnel (`cloudflared tunnel --url http://127.0.0.1:5000`).
4. Prints **ONLY** the generated live HTTPS Cloudflare link to standard output.
