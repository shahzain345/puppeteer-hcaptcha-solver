import { PythonShell } from "python-shell"

export const get_result = (imgUrl, label): Promise<string | null> => {
    return new Promise((resolve) => {
        let options = {
            args: [imgUrl, label],
          }
        PythonShell.run("recognition/yolo_run.py", options, (err, result) => {
            if (err) throw err;
            if (result != undefined) {
                if (result[0] == "True") {
                    resolve("true");
                } else {
                    resolve("false")
                }
            } else {
                resolve(null)
            }
        })
    })
}