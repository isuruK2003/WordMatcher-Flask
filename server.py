from flask import Flask, render_template

app = Flask(__name__)
app.config["words_file"] = "./static/wiktionary.txt"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/words", methods= ["POST", "GET"])
def get_words():
    data = []
    with open(app.config["words_file"], "r") as file:
        data = file.read().strip().split("\n")
    return data

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
