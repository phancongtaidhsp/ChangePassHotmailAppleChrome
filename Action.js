const promiseAny = require('promise.any');
const { delay } = require('./helper');

const action = async (page, record) => {
  const [mail, pass] = record;

  await page.bringToFront();

  await page.goto('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=9199bf20-a13f-4107-85dc-02114787ef48&scope=https%3A%2F%2Foutlook.office.com%2F.default%20openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Foutlook.office365.com%2Fmail%2F&client-request-id=70144b1f-8850-eecc-730c-e036bfe233ea&response_mode=fragment&client_info=1&prompt=select_account&nonce=019a3588-3810-78a0-b0e1-5b8377a035f3&state=eyJpZCI6IjAxOWEzNTg4LTM4MTAtN2NhMi05Y2I3LTNmZjkwYTQ3ZWRiZSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D%7CaHR0cHM6Ly9vdXRsb29rLm9mZmljZTM2NS5jb20vbWFpbC8&claims=%7B%22access_token%22%3A%7B%22xms_cc%22%3A%7B%22values%22%3A%5B%22CP1%22%5D%7D%7D%7D&x-client-SKU=msal.js.browser&x-client-VER=4.14.0&response_type=code&code_challenge=YfO7mOcosXqveSGEQ-ORxwt-00vLlMRn7_28vPJi83g&code_challenge_method=S256&sso_reload=true', { timeout: 30000 });
  
  await page.waitForSelector('input[type="email"]');

  await delay(1000);

  await page.type('input[type="email"]', mail, { delay: 30 });

  await delay(1000);

  await page.click('input[type="submit"]');

  await delay(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('input[type="password"]'),
    page.waitForSelector('#proof-confirmation-email-input'),
    page.waitForSelector('#usernameError'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress'),
    page.waitForSelector('#error_Info'),
  ])

  await delay(2000);

  let [usepassBtn] = await page.$x("//span[normalize-space(text())='Use your password']");
  if (usepassBtn) {
    await usepassBtn.click();
  }

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('input[type="password"]'),
    page.waitForSelector('#usernameError'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress'),
    page.waitForSelector('#error_Info'),
  ])

  await page.waitFor(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('input[type="password"]'),
  ])

  await page.type('input[type="password"]', pass, { delay: 30 });

  await delay(1000);

  await page.click('input[type="submit"]');

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('#serviceAbuseLandingTitle'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress .c_dotsPlaying'),
    page.waitForSelector('#error_Info'),
    page.waitForSelector('#idTD_Error'),
    page.waitForSelector('#iProofList'),
    page.waitForSelector('#kmsiTitle'),
    page.waitForSelector('#iShowSkip'),
    page.waitForSelector("#acceptButton")
  ])

  await delay(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('#serviceAbuseLandingTitle'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress .c_dotsPlaying'),
    page.waitForSelector('#error_Info'),
    page.waitForSelector('#idTD_Error'),
    page.waitForSelector('#iProofList'),
    page.waitForSelector('#kmsiTitle'),
    page.waitForSelector('#iShowSkip'),
    page.waitForSelector("#acceptButton")
  ])

  let acceptBtn = await page.$("#acceptButton");
  if (acceptBtn) {
    await acceptBtn.click();
  }

  try {
    let frameHandle = await page.waitForSelector("#unified_consent_dialog_frame", { timeout: 120000 })
    let iFrame = await frameHandle.contentFrame();
    await delay(1000);
    await iFrame.waitFor("#unified-consent-continue-button");
    await delay(1000);
    await iFrame.evaluate(() => {
      window.scrollTo(0, 9999);
    });
    await delay(1000);
    await iFrame.click("#unified-consent-continue-button");
    await delay(1000);
    await iFrame.evaluate(() => {
      window.scrollTo(0, 9999);
    });
    await delay(1000);
    await iFrame.click("#unified-consent-continue-button");
  } catch (error) {
    console.log(error);
    console.log("There is no A quick note about your Microsoft account")
  }

  console.log("Done");

  await delay(9999999);

};
module.exports = action;