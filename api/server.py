from flask import Flask, request
from flask_cors import CORS
import json
import base64
from jobAnalysis import analysis
app = Flask(__name__)
CORS(app)



@app.route("/api/python")
def hello_world():
    return "<div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}><h2>Hello, World!<h2></div>"


@app.route("/api/process", methods=['POST'])
def process():
    data = request.get_json()
    job_description = data.get('data')
    img_path = analysis.create_word_cloud(job_description)
    with open(img_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

    response = {
        "jobDesc": job_description,
        "img_data": encoded_image
    }

    return json.dumps(response)




if __name__ == '__main__':
    app.run(debug=True)