"""Diagnostic endpoint — GET /api/python-health"""
from http.server import BaseHTTPRequestHandler
import json, sys, os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Check for the template file
        candidates = [
            os.path.join(os.path.dirname(__file__), 'bluehost-template.pptx'),
            '/var/task/api/bluehost-template.pptx',
            os.path.join(os.getcwd(), 'api', 'bluehost-template.pptx'),
        ]
        template_check = {p: os.path.exists(p) for p in candidates}

        # Check pptx import
        try:
            from pptx import Presentation
            pptx_ok = True
            pptx_err = None
        except Exception as e:
            pptx_ok = False
            pptx_err = str(e)

        info = {
            "python_version": sys.version,
            "cwd": os.getcwd(),
            "file": __file__,
            "template_candidates": template_check,
            "pptx_importable": pptx_ok,
            "pptx_error": pptx_err,
        }

        body = json.dumps(info, indent=2).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_):
        pass
