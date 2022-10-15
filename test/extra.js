const { PuppeterHcaptchaSolve } = require('../lib')
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const captcha = new PuppeterHcaptchaSolve(browser, true)
    try {
        const page = (await browser.pages())[0]
        await page.goto('https://accounts.hcaptcha.com/demo?sitekey=4c672d35-0701-42b2-88c3-78380b0db560', {
            waitUntil: 'load',
            timeout: 0
        })
        await page.waitForSelector('iframe')
        console.log('Hcaptcha detected')
        setTimeout(async () => {
            const token = await captcha.solve(page)
            console.log("Function resolvedd")
            console.log(token)
        }, 2000)
    } catch (e) {
        throw e
    }
})()
