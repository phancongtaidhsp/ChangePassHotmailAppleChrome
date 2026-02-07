const promiseAny = require('promise.any');
const { delay, generatePassword } = require('./helper');
const { sendMail, changePassword } = require('./apple');

const action = async (page, record) => {
  const [mailHotmail, passHotmail, proxiesApple] = record;
  await page.bringToFront();

  await page.goto('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=9199bf20-a13f-4107-85dc-02114787ef48&scope=https%3A%2F%2Foutlook.office.com%2F.default%20openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Foutlook.office365.com%2Fmail%2F&client-request-id=70144b1f-8850-eecc-730c-e036bfe233ea&response_mode=fragment&client_info=1&prompt=select_account&nonce=019a3588-3810-78a0-b0e1-5b8377a035f3&state=eyJpZCI6IjAxOWEzNTg4LTM4MTAtN2NhMi05Y2I3LTNmZjkwYTQ3ZWRiZSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D%7CaHR0cHM6Ly9vdXRsb29rLm9mZmljZTM2NS5jb20vbWFpbC8&claims=%7B%22access_token%22%3A%7B%22xms_cc%22%3A%7B%22values%22%3A%5B%22CP1%22%5D%7D%7D%7D&x-client-SKU=msal.js.browser&x-client-VER=4.14.0&response_type=code&code_challenge=YfO7mOcosXqveSGEQ-ORxwt-00vLlMRn7_28vPJi83g&code_challenge_method=S256&sso_reload=true', { timeout: 90000 });
  
  await page.waitForSelector('input[type="email"]');

  await delay(1000);

  await page.type('input[type="email"]', mailHotmail, { delay: 30 });

  await delay(1000);

  await page.click('input[type="submit"]');

  await delay(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 90000 }),
    page.waitForSelector('input[type="password"]'),
    page.waitForSelector('#proof-confirmation-email-input'),
    page.waitForSelector('#usernameError'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress'),
    page.waitForSelector('#error_Info'),
  ])

  await delay(1000);

  // Use evaluateHandle instead of $x (which is deprecated in newer Puppeteer versions)
  try {
    const clicked = await page.evaluate((xpath) => {
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const element = result.singleNodeValue;
      if (element) {
        element.click();
        return true;
      }
      return false;
    }, "//span[normalize-space(text())='Use your password']");
  } catch (error) {
    // Element not found, continue
  }

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 90000 }),
    page.waitForSelector('input[type="password"]'),
    page.waitForSelector('#usernameError'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress'),
    page.waitForSelector('#error_Info'),
  ])

  await delay(1000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 90000 }),
    page.waitForSelector('input[type="password"]'),
  ])

  await page.type('input[type="password"]', passHotmail, { delay: 30 });

  await delay(2000);

  await page.click('button[type="submit"]');

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 90000 }),
    page.waitForSelector('#serviceAbuseLandingTitle'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress .c_dotsPlaying'),
    page.waitForSelector('#error_Info'),
    page.waitForSelector('#idTD_Error'),
    page.waitForSelector('#iProofList'),
    page.waitForSelector('#kmsiTitle'),
    page.waitForSelector('#iShowSkip'),
    page.waitForSelector('#acceptButton'),
    page.waitForSelector('#iTOUDesc'),
    page.waitForSelector('#frmAddProof'),
  ])

  // send mail apple for change password
  console.log("sending mail...");
  let sendMailRes = '';
  for (let i = 0; i < 5; i++) {
    console.log("sending mail " + i + "...");
    let proxyApple = proxiesApple[i] || proxiesApple[0];
    sendMailRes = await sendMail(mailHotmail, proxyApple);
    if (sendMailRes === 'successfully') {
      break;
    } else {
      await delay(2000);
    }
  }

  await delay(3000);

  if (sendMailRes === 'successfully') {
    console.log("sending mail thanh cong...");
    await delay(10000);
    await page.goto('https://outlook.live.com/mail/0/', { timeout: 90000 });

    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 90000 }),
      page.waitForSelector('#MailList'),
      page.waitForSelector('#shadowDiv .ms-Button-label'),
      page.waitForSelector('.fui-DialogActions button:nth-child(2)'),
    ])

    let btnDialog = await page.$('.fui-DialogActions button:nth-child(2)');
    if (btnDialog) {
      await btnDialog.click();
      await delay(2000);
    }

    let btnQuickNote = await page.$('#shadowDiv .ms-Button-label');
    if (btnQuickNote) {
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      await delay(2000);
      await btnQuickNote.click();
      await delay(2000);
    }

    await page.waitForSelector('#MailList .customScrollBar', { timeout: 90000 });

    await delay(2000);

    await page.evaluate(() => {
      const titleAppleEl = document.querySelector('#MailList .customScrollBar div[role="option"] span[title="appleid@id.apple.com"]');
      if (titleAppleEl) {
        titleAppleEl.click();
      }
    });

    await page.waitForSelector('#ReadingPaneContainerId .x_container a[role="link"]', { timeout: 90000 });
    await delay(2000);
    let linkChangePassword = await page.evaluate(() => {
      const linkChangePasswordEl = document.querySelector('#ReadingPaneContainerId .x_container a[role="link"]');
      if (linkChangePasswordEl) {
        return linkChangePasswordEl.href;
      }
      return '';
    });
    console.log("linkChangePassword: " + linkChangePassword);
    if (linkChangePassword) {
      for (let i = 0; i < 5; i++) {
        let proxyApple = proxiesApple[i] || proxiesApple[0];
        let passwd = generatePassword();
        const resChanged = await changePassword(passwd, linkChangePassword, proxyApple);
        if (resChanged === 'successfully') {
          console.log("doi pass thanh cong");
          return Promise.resolve([passwd, "pass"]);
        }
        await delay(2000);
      }
    }
    return Promise.resolve(['', "fail step 3"]);
  } else {
    return Promise.resolve(['', sendMailRes]);
  }
};
module.exports = action;