from flask import Flask, request, jsonify

from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment. Copy .env.example to .env and add your key.")

genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app)

@app.route("/healthz")
def healthz():
    return {"status": "ok"}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    user_input = data.get("message", "")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400
    try:
        response = model.generate_content(user_input)
        text = ""
        if hasattr(response, "text"):
            text = response.text
        else:
            try:
                text = "\n".join([c.text for c in response.output[0].content])
            except Exception:
                text = str(response)
        return jsonify({"reply": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
