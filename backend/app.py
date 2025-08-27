import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Load Gemini API Key
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment.")

# Configure Gemini
genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# Flask app
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

        # Always extract clean text
        bot_reply = ""
        if hasattr(response, "text") and response.text:
            bot_reply = response.text.strip()
        else:
            try:
                bot_reply = "\n".join([c.text for c in response.output[0].content if c.text]).strip()
            except Exception:
                bot_reply = str(response)

        # Return structured JSON
        return jsonify({
            "status": "success",
            "reply": bot_reply,
            "meta": {
                "length": len(bot_reply.split()),
                "lines": bot_reply.count("\n") + 1
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

        @app.route('/')
def home():
    return "Flask app running on AWS Elastic Beanstalk!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
