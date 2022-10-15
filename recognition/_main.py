# Author: Shahzain
# Credits: https://github.com/QIN2DIM/hcaptcha-challenger
from flask import Flask, request
import httpx
import hcaptcha_challenger as solver


solver.install()
client = httpx.Client(timeout=60)


def get_result(imgUrl: str, label: str) -> bool:
    challenger = solver.new_challenger()
    imgs = [client.get(imgUrl).read()]
    if result := challenger.classify(prompt=label, images=imgs):
        for i, _ in enumerate(imgs):
            if result[i]:
                return True
            else:
                return False


app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello():
    return "Server is up."


@app.route("/getresult", methods=["POST"])
def getresult():
    try:
        res = get_result(request.get_json()["image_url"], request.get_json()["label"])
        if res:
            res = "true"
        else:
            res = "false"
        return res
    except Exception as e:
        return str(e)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7980)
