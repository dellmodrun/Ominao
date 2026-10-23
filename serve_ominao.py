from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
INJECTION = b'<link rel="icon" type="image/png" href="/ominao-logo.png"><link rel="stylesheet" href="/ominao-terminal.css"><script src="/ominao-brand.js" defer></script>'
DESCRIPTION = 'Ominao is a privacy-native Solana fork for confidential MCP calls, private settlement and verifiable agent execution.'


class OminaoHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        translated = Path(super().translate_path(path))
        try:
            relative = translated.relative_to(Path.cwd())
        except ValueError:
            return str(translated)
        return str(ROOT / relative)

    def send_head(self):
        path = Path(self.translate_path(self.path.split('?', 1)[0]))
        if path.is_dir():
            path = path / 'index.html'
        if path.suffix.lower() != '.html' or not path.exists():
            return super().send_head()

        route = self.path.split('?', 1)[0].rstrip('/') or '/'
        titles = {
            '/': 'Ominao ? Private Execution Network',
            '/nodes': 'Relay Network ? Ominao',
            '/docs': 'Integration ? Ominao',
        }
        title = titles.get(route, titles['/'])
        data = path.read_bytes()
        data = re.sub(
            rb'<title>.*?</title>',
            f'<title>{title}</title>'.encode('utf-8'),
            data,
            count=1,
            flags=re.DOTALL,
        )
        data = re.sub(
            rb'<meta name="description" content=".*?"/>',
            f'<meta name="description" content="{DESCRIPTION}"/>'.encode('utf-8'),
            data,
            count=1,
            flags=re.DOTALL,
        )
        if b'ominao-brand.js' not in data:
            data = data.replace(b'</head>', INJECTION + b'</head>')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        from io import BytesIO
        return BytesIO(data)


if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', 4174), OminaoHandler)
    print('Ominao terminal site: http://127.0.0.1:4174/', flush=True)
    server.serve_forever()
