import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def parseVideo():
    if request.method == 'POST':
        link = request.form['link']
        res = requests.post('http://www.clipconverter.cc/check.php', {'mediaurl': link})
        return res.text
    else:
        return '1.0.0'

# app.run(host='0.0.0.0', port=80, threaded = True)