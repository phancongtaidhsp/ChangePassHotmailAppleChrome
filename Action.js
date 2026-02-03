const promiseAny = require('promise.any');
const { delay } = require('./helper');

const action = async (context, page, record) => {
  const [mailHotmail, passHotmail, phoneObject] = record;
  console.log("phoneObject...");
  console.log(phoneObject);
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

  let serviceAbuseLandingNextBtn = await page.$('#StartAction');
  if (serviceAbuseLandingNextBtn) {
    await serviceAbuseLandingNextBtn.click();
    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
      page.waitForSelector('#proofField'),
    ]);
    await delay(1000);
    await page.type('#proofField', phoneObject.phoneDaisySMS, { delay: 30 });
  }

  console.log("vaoday1...");

  await delay(9999000);

  // let textBoxMailKP = await page.$('#proof-confirmation-email-input');
  // if (textBoxMailKP) {
  //   await textBoxMailKP.type(`${emailKP}@disbox.org`, { delay: 30 });
  //   await delay(2000);
  //   let pageKP = await context.newPage();
  //   await pageKP.goto('https://moakt.com', { timeout: 30000 });
  //   await pageKP.waitForSelector('input[name="username"]');
  //   await delay(1000);
  //   await pageKP.type('input[name="username"]', emailKP, { delay: 30 });
  //   await delay(1000);
  //   await pageKP.select('select[name="domain"]', 'disbox.org');
  //   await delay(1000);
  //   await pageKP.click('input[name="setemail"]');
  //   await promiseAny([
  //     pageKP.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //     pageKP.waitForSelector('a[href="/en/inbox"]'),
  //   ])
  //   await delay(3000);
  //   await page.bringToFront();
  //   await delay(2000);
  //   await page.click('button[type="submit"]');
  //   await delay(2000);
  //   await pageKP.bringToFront();
  //   let flagMSEmail = false;
  //   for (let i = 0; i < 7; i++) {
  //     let mailList = await pageKP.$('#maillist');
  //     if (mailList) {      
      
  //       const msEmail = await pageKP.$('#email_message_list a');
  //       if (msEmail) {
  //         await msEmail.click();
  //         flagMSEmail = true;
  //         break;
  //       } else {
  //         await pageKP.reload();
  //         console.log("Reloading page KP: " + i);
  //         await delay(3000);
  //       }
  //     } else {
  //       break;
  //     }
  //   }
  //   if (!flagMSEmail) {
  //     console.log("vaoday...");
  //     await delay(99999000);
  //     return "";
  //   }

  //   console.log("vaoday2...");
  //   await promiseAny([
  //     pageKP.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //     pageKP.waitForSelector(".message-content iframe"),
  //   ])

  //   const iframeHandle = await pageKP.waitForSelector(".message-content iframe", { timeout: 5000 });
  //   const iframe = await iframeHandle.contentFrame();
  //   await delay(3000);
  //   const codeMailKP = await iframe.evaluate(() => {
  //     const bodyContent = document.querySelector("body").textContent;
  //     const match = bodyContent.match(/: (\d{6})/);
  //     return match ? match[1] : null;
  //   });

  //   if (!codeMailKP) {
  //     return "";
  //   }

  //   console.log("Code Mail KP: ");
  //   console.log(codeMailKP);

  //   await page.bringToFront();
  //   await delay(1000);
  //   await page.type('input[type="text"]', codeMailKP, { delay: 60 });
  //   await promiseAny([
  //     page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //     page.waitForSelector("#iLandingViewAction"),
  //     page.waitForSelector("#iPassword"),
  //   ])
  //   await delay(2000);
  //   let viewAction = await page.$("#iLandingViewAction");
  //   if (viewAction) {
  //     await viewAction.click();
  //     await promiseAny([
  //       page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //       page.waitForSelector("#iPassword"),
  //     ])
  //     await delay(2000);
  //   }

  //   let password = await page.$("#iPassword");
  //   if (password) {
  //     await password.type(passHotmailNew, { delay: 30 });
  //     await delay(1000);
  //     await page.click('#iPasswordViewAction');
  //     await promiseAny([
  //       page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //       page.waitForSelector("#iReviewProofsViewAction"),
  //     ])
  //     await delay(2000);
  //   }
  //   isChangedPassword = true;
  //   let iReviewProofsViewAction = await page.$("#iReviewProofsViewAction");
  //   if (iReviewProofsViewAction) {
  //     await iReviewProofsViewAction.click();
  //     await promiseAny([
  //       page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //       page.waitForSelector("#iCollectProofsViewAlternate"),
  //     ])
  //     await delay(2000);
  //   }
  //   let iCollectProofsViewAlternate = await page.$("#iCollectProofsViewAlternate");
  //   if (iCollectProofsViewAlternate) {
  //     await iCollectProofsViewAlternate.click();
  //     await promiseAny([
  //       page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //       page.waitForSelector("#iFinishViewAction"),
  //     ])
  //     await delay(2000);
  //   }
  //   let iFinishViewAction = await page.$("#iFinishViewAction");
  //   if (iFinishViewAction) {
  //     await iFinishViewAction.click();
  //     await promiseAny([
  //       page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 30000 }),
  //       page.waitForFunction((xpath) => {
  //         const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  //         return result.singleNodeValue !== null;
  //       }, { timeout: 30000 }, "//span[normalize-space(text())='Use your password']"),
  //     ])
  //     await delay(1000);
  //   }
  // }

  let acceptBtn = await page.$("#acceptButton");
  if (acceptBtn) {
    await acceptBtn.click();
    await delay(7000);
  }

  let iTOUDesc = await page.$("#iTOUDesc");
  if (iTOUDesc) {
    await page.click('button[type="submit"]');
    await delay(7000);
  }

  console.log("Done");

  await delay(9999999);

};
module.exports = action;