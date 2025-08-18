# Author: Shahzain
# Credits: https://github.com/QIN2DIM/hcaptcha-challenger

from flask import Flask, request
import httpx
import hcaptcha_challenger as solver

client = httpx.Client(timeout=60)


def get_result(imgUrl: str, label: str) -> bool:
    challenger = solver.new_challenger()
    imgs = [client.get(imgUrl).content]   
    
    result = challenger.classify(prompt=label, images=imgs)

    if result:
        return any(result)
    return False


app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello():
    return "Server is up."


@app.route("/getresult", methods=["POST"])
def getresult():
    try:
        data = request.get_json()
        res = get_result(data["image_url"], data["label"])
        return "true" if res else "false"
    except Exception as e:
        return str(e)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7980)
