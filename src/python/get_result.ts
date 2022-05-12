import { PythonShell } from 'python-shell'

export const get_result = async (imgUrl, label): Promise<string | null> => {
  return await new Promise((resolve) => {
    const options = {
      args: [imgUrl, label]
    }
    PythonShell.run('recognition/yolo_run.py', options, (err, result) => {
      if (err != null) throw err
      if (result != undefined) {
        if (result[0] == 'True') {
          resolve('true')
        } else {
          resolve('false')
        }
      } else {
        resolve(null)
      }
    })
  })
}
