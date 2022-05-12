# Puppteer-Hcaptcha-Solver

Solve Hcaptcha on any website using puppeteer
Author: Shahzain
PRS Are greatly appreciated.
# Installation:

`yarn add puppeteer-hcaptcha-solver`

`npm install puppeteer-hcaptcha-solver`

## Basic Usage:

Note: You need python to use this module.

```js
const { PuppeterHcaptchaSolve } = require("puppeteer-hcaptcha-solver");
const puppeteer = require("puppeteer");
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const captcha = new PuppeterHcaptchaSolve(browser);
    try {
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);

        await page.goto("https://accounts.hcaptcha.com/demo?sitekey=4c672d35-0701-42b2-88c3-78380b0db560", {
            waitUntil: 'load',
            timeout: 0

        });
        await page.waitForSelector("iframe")
        console.log("Hcaptcha detected")
        setTimeout(async () => {
            await captcha.solve(page);
        }, 2000)
    } catch (e) {
        throw e
    }
})()
```

