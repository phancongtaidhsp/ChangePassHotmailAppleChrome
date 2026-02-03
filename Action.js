const promiseAny = require('promise.any');
const { delay } = require('./helper');

const action = async (browser, context, page, record) => {
  const [mailHotmail, passHotmail, mailTemp] = record;
  await page.bringToFront();

  await page.goto('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=9199bf20-a13f-4107-85dc-02114787ef48&scope=https%3A%2F%2Foutlook.office.com%2F.default%20openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Foutlook.office365.com%2Fmail%2F&client-request-id=70144b1f-8850-eecc-730c-e036bfe233ea&response_mode=fragment&client_info=1&prompt=select_account&nonce=019a3588-3810-78a0-b0e1-5b8377a035f3&state=eyJpZCI6IjAxOWEzNTg4LTM4MTAtN2NhMi05Y2I3LTNmZjkwYTQ3ZWRiZSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D%7CaHR0cHM6Ly9vdXRsb29rLm9mZmljZTM2NS5jb20vbWFpbC8&claims=%7B%22access_token%22%3A%7B%22xms_cc%22%3A%7B%22values%22%3A%5B%22CP1%22%5D%7D%7D%7D&x-client-SKU=msal.js.browser&x-client-VER=4.14.0&response_type=code&code_challenge=YfO7mOcosXqveSGEQ-ORxwt-00vLlMRn7_28vPJi83g&code_challenge_method=S256&sso_reload=true', { timeout: 30000 });
  
  await page.waitForSelector('input[type="email"]');

  await delay(1000);

  await page.type('input[type="email"]', mailHotmail, { delay: 30 });

  await delay(1000);

  await page.click('input[type="submit"]');

  await delay(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
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
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
    page.waitForSelector('input[type="password"]'),
    page.waitForSelector('#usernameError'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress'),
    page.waitForSelector('#error_Info'),
  ])

  await delay(1000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
    page.waitForSelector('input[type="password"]'),
  ])

  await page.type('input[type="password"]', passHotmail, { delay: 30 });

  await delay(2000);

  await page.click('button[type="submit"]');

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
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
  ])

  await delay(5000);

  await page.goto('https://outlook.live.com/mail/0/options/mail/forwarding', { timeout: 30000 });

  await page.waitForSelector('.fui-DialogActions button:nth-child(2)');

  await delay(3000);

  await page.click('.fui-DialogActions button:nth-child(2)');

  await page.waitForSelector('.ms-Modal-scrollableContent div[role="tabpanel"] .customScrollBar button');

  await delay(3000);

  await page.click('.ms-Modal-scrollableContent div[role="tabpanel"] .customScrollBar button');

  // In Puppeteer, we need to wait for a new target/page to be created
  const newTarget = await browser.waitForTarget(target => target.opener() === page.target());
  const popup = await newTarget.page();

  await delay(2000);

  await popup.bringToFront();

  // Wait for the password input to appear
  await popup.waitForSelector('input[type="password"]', { timeout: 30000 });
  
  await delay(2000);
  
  await popup.type('input[type="password"]', passHotmail, { delay: 30 });

  await delay(2000);

  await popup.click('button[type="submit"]');

  await popup.waitForSelector('#EmailAddress');

  await delay(2000);

  // Create temp email on smvmail.com
  let pageTempEmail = await context.newPage();
  await pageTempEmail.bringToFront();
  await pageTempEmail.goto('https://smvmail.com', { timeout: 30000 });
  await pageTempEmail.waitForSelector('input[name="email"]');
  await delay(2000);
  await pageTempEmail.type('input[name="email"]', mailTemp, { delay: 30 });
  await delay(2000);
  await pageTempEmail.click('form button');
  await delay(2000);
  await pageTempEmail.waitForSelector('header button');

  await popup.bringToFront();
  await delay(2000);
  await popup.type('#EmailAddress', mailTemp, { delay: 30 });
  await delay(2000);
  await popup.click('.position-buttons input[type="submit"]');
  await popup.waitForSelector('#iOttText');
  await delay(2000);
  await pageTempEmail.bringToFront();
  await delay(2000);
  let codeMailTemp = '';
  for (let i = 0; i < 7; i++) {
    let aElment = await pageTempEmail.$('main ul a');
    if (aElment) {
      await pageTempEmail.click('main ul a');
      await pageTempEmail.waitForSelector('tbody');
      await delay(3000);
      codeMailTemp = await pageTempEmail.evaluate(() => {
        const textContent = document.querySelector('tbody').textContent;
        const match = textContent.match(/\d{6}/);
        return match ? match[0] : "";
      });
      break;
    } else {
      await delay(2000);
      await pageTempEmail.click('header button');
      await delay(2000);
    }
  }

  if (!codeMailTemp) {
    console.log("No code mail temp");
    return "No code mail temp";
  }

  await popup.bringToFront();
  await delay(2000);
  await popup.type('#iOttText', codeMailTemp, { delay: 30 });
  await delay(2000);
  await popup.click('.position-buttons input[type="submit"]');
  await delay(2000);
  await popup.waitForSelector('#view button:nth-child(2)');
  await delay(2000);
  await popup.click('#view button:nth-child(2)');
  await delay(5000);

  return "done";
};
module.exports = action;