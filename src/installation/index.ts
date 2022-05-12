import axios from "axios";
import fs from 'fs';
import { exec } from 'child_process';
import os from 'os';
export const install_py_files = async () => {
    if(!fs.existsSync("./recognition/yolo_run.py")) {
        exec("mkdir recognition")
        exec("touch ./recognition/yolo_run.py")
        exec("touch ./recognition/yolo.py")
        setTimeout(async () => {
            const { data } = await axios.get("https://raw.githubusercontent.com/shahzain345/puppeteer-hcaptcha-solver/main/recognition/yolo_run.py");
            fs.writeFile("./recognition/yolo_run.py", data, (err) => {
                if (err) throw err;
            })
            console.log(`Installed yolo_run.py file...`)
            const d2 = await axios.get("https://raw.githubusercontent.com/shahzain345/puppeteer-hcaptcha-solver/main/recognition/yolo.py");
            fs.writeFile("./recognition/yolo.py", d2.data, (err) => {
                if (err) throw err;
            })
            console.log(`Installed all files...`)
            if (os.type() == "Darwin") {
                exec("python3 --version", (err, stdout) => {
                    if (err) throw Error("Python3 not found. Please install python to use this package")
                })
            } else {
                exec("python --version", (err, stdout) => {
                    if (err) throw Error("Python3 not found. Please install python to use this package")
                })
            }
            exec('pip install opencv-python requests httpx') // Install all the required python modules.
        }, 4000)
    }
}