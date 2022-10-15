import axios from "axios";
import fs from 'fs';
import { exec } from 'child_process';
import os from 'os';
export const install_py_files = async () => {
    if (!fs.existsSync("./recognition/_main.py")) {
        exec("mkdir recognition")
        exec("touch ./recognition/_main.py")
        setTimeout(async () => {
            const { data } = await axios.get("https://raw.githubusercontent.com/shahzain345/puppeteer-hcaptcha-solver/main/recognition/_main.py");
            fs.writeFile("./recognition/_main.py", data, (err) => {
                if (err) throw err;
            })
            console.log(`Installed _main.py file...`)
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
            exec('pip install opencv-python requests httpx flask hcaptcha-challenger') // Install all the required python modules.
            return true;
        }, 4000)
    } else {
        return true;
    }
}