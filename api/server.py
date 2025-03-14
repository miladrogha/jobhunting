from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import base64
from jobAnalysis import analysis, alpha
app = Flask(__name__)
CORS(app)


@app.route("/api/python")
def hello_world():
    return "<div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}><h2>Hello, World!<h2></div>"


@app.route("/api/process", methods=['POST'])
def process():
    data = request.get_json()
    job_description = data.get('data')
    img_path, freq = analysis.create_word_cloud(job_description)
    with open(img_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

    technical_req = alpha.get_tech_req(job_dec=job_description)
    # technical_req = jsonify(technical_req)

    response = {
        "img_data": encoded_image,
        "word_freq": freq,
        "technical_req": technical_req
    }
    return json.dumps(response)


@app.route("/api/ask-alpha", methods=['POST'])
def askAlpha():
    data = request.get_json()
    message = data.get('data')
    try:
        # Call the ask_alpha function to get a list of JSON objects from the stream
        results = alpha.ask_alpha(message)
        print(f'[askAlpha] Successfully received response from Alpha!')
        return jsonify(results)
    except Exception as e:
        print("Error", e)
        return str(e), 500


if __name__ == '__main__':
    app.run(debug=True)