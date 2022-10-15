import { PythonShell } from 'python-shell';
import axios from 'axios';
const _start_server = async () => {
  await axios.get("http://127.0.0.1:7980").catch(e => {
    PythonShell.run("recognition/_main.py", {}, (err, response) => {
      if (err) throw err;
    }) // start our HTTP Server.
    console.debug("HTTP Server started on http://127.0.0.1:7980");
  }) // otherwise the server is already up and we can start sending HTTP Requests to it.
}
export const get_result = async (imgUrl: string, label: string): Promise<boolean | null> => {
  return await new Promise(async (resolve) => {
    const { data } = await axios.post("http://127.0.0.1:7980/getresult", {
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
_start_server();