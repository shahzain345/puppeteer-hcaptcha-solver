from yolo import YOLO
import sys, httpx
YOLO(dir_model=None, onnx_prefix="yolov5n6").download_model()
def get_result(imgUrl: str, label: str) -> bool:
    return YOLO(dir_model=None, onnx_prefix="yolov5n6").solution(img_stream=httpx.get(imgUrl).read(), label=label)
print(get_result(sys.argv[1], sys.argv[2]))