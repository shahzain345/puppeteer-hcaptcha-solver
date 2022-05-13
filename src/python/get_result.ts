import { PythonShell } from 'python-shell';
import axios from 'axios';
const _start_server = async () => {
  await axios.get("http://localhost:7980").catch(e => {
    PythonShell.run("recognition/yolo_run.py", {}, (err, response) => {
      if (err) throw err;
    }) // start our HTTP Server.
    console.log("HTTP Server started on http://localhost:7980");
  }) // otherwise the server is already up and we can start sending HTTP Requests to it.
}
export const get_result = async (imgUrl: string, label: string): Promise<boolean | null> => {
  return await new Promise(async (resolve) => {
    const { data } = await axios.post("http://localhost:7980/getresult", {
      image_url: imgUrl,
      label
    }, {
      headers: {
        "content-type": "application/json"
      }
    });
    resolve(data);
  })
}
_start_server()