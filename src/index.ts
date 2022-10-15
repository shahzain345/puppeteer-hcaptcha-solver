/**
 * @author Shahzain Masood
 * Github: https://github.com/shahzain345/puppeteer-hcaptcha-solver
 */
import { Page, Frame, Browser } from 'puppeteer'
import { get_result } from './python/get_result'
import { install_py_files } from './installation'
install_py_files()
export class PuppeterHcaptchaSolve {
  browser: Browser
  constructor (browser: Browser) {
    this.browser = browser
  }
  async solve (page: Page) {
    const isElmPresent = await this._detect_captcha(page)
    if (isElmPresent) {
      await page.click('iframe')
      const frame = await page.frames()[1]
      if (frame !== null) {
        await frame.waitForSelector('.prompt-text')
        const elm = await frame.$('.prompt-text')
        const _challenge_question = await frame.evaluate(el => el.textContent, elm)
        const _label = await this._get_label(_challenge_question)
        const token = await this._click_good_images(frame, _label, page);
        return token
      }
    } else {
      throw Error('Captcha not detected')
    }
  }

  private async _detect_captcha (page: Page) {
    try {
      await page.waitForSelector('iframe')

      return true
    } catch (e) {
      return false
    }
  }

  private async _click_submit (frame: Frame) {
    await frame.click(".button-submit")
  }

  private async _click_good_images (frame: Frame, label: string, page: Page): Promise<string | undefined> {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
          for (let i = 0; i < 9; i++) {
            await frame.waitForSelector(`div.task-image:nth-child(${i + 1})`, {
              visible: true
            })
            await frame.waitForSelector(`div.task-image:nth-child(${i + 1}) > div:nth-child(2) > div:nth-child(1)`, {
              visible: true
            })
            const elementHandle = await frame.$(`div.task-image:nth-child(${i + 1}) > div:nth-child(2) > div:nth-child(1)`)
            const style: string = await frame.evaluate((el) => el.getAttribute('style'), elementHandle)
            const url = await style.split('url("')[1].split('")')[0]
            const res = await get_result(url, label)
            if (res) {
              await frame.click(`div.task-image:nth-child(${i + 1})`);
            }
            if (i == 8) {
              await this._click_submit(frame)
              setTimeout(async () => {
                const token = await page.evaluate("hcaptcha.getResponse();");
                resolve(token)
              }, 2000)
            }
          }
        }, 3000)
    })
  }

  private _get_label (label: string): Promise<string> {
    if (label.includes('containing')) {
      label = label.includes('an') ? label.split('containing an ')[1] : label.split('containing a ')[1]
    }
    const label_aliases = {
      airplane: 'aeroplane',
      аirplane: 'aeroplane',
      motorbus: 'bus',
      mοtorbus: 'bus',
      truck: 'truck',
      truсk: 'truck',
      motorcycle: 'motorbike',
      boat: 'boat',
      bicycle: 'bicycle',
      train: 'train',
      'vertical river': 'vertical river',
      'airplane in the sky flying left': 'airplane in the sky flying left',
      'airplanes in the sky that are flying to the left': 'airplane in the sky flying left',
      'airplanes in the sky that are flying to the right': 'airplane in the sky flying right'
    }
    if (label in label_aliases) {
      return label_aliases[label]
    } else {
      throw Error('Unsolvable captcha')
    }
  }
}
