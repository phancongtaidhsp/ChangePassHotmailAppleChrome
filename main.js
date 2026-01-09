const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const path = require('node:path');
const fs = require('fs-extra');
const ipc = electron.ipcMain;
const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { splitArrayIntoChunks, delay } = require('./helper');
const Action = require('./Action');

let flagPause = false;
let win;
let interval;
let currentIndex = 0;
let numberOfThread = 4;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const run = async function (thread, mailInfo) {
  let outsuccess = `${__dirname}\\..\\extraResources\\MsTeams\\success.txt`;
  let outfail = `${__dirname}\\..\\extraResources\\MsTeams\\mailexist.txt`;
  let position = {
    x: 0,
    y: 0
  }
  if (thread == 1 || thread == 11) {
    position = {
      x: 300,
      y: 0
    }
  } else if (thread == 2 || thread == 12) {
    position = {
      x: 600,
      y: 0
    }
  } else if (thread == 3 || thread == 13) {
    position = {
      x: 900,
      y: 0
    }
  } else if (thread == 4 || thread == 14) {
    position = {
      x: 1200,
      y: 0
    }
  } else if (thread == 5 || thread == 15) {
    position = {
      x: 0,
      y: 500
    }
  } else if (thread == 6 || thread == 16) {
    position = {
      x: 300,
      y: 500
    }
  } else if (thread == 7 || thread == 17) {
    position = {
      x: 600,
      y: 500
    }
  } else if (thread == 8 || thread == 18) {
    position = {
      x: 900,
      y: 500
    }
  } else if (thread == 9 || thread == 19) {
    position = {
      x: 1200,
      y: 500
    }
  }
  await delay((thread + 1) * 100);
  let browser = await puppeteer.launch({
    // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [`--window-size=500,600`, `--window-position=${position.x},${position.y}`,
      '--disable-infobars',
      '--disk-cache-size=0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
    ],
  });
  let context = await browser.createBrowserContext();
  let page = await context.newPage();
  const [mail, pass] = mailInfo.split("|");
  let resultAction = await Action(page, [mail, pass]);
  if (resultAction) {
    fs.appendFileSync(outsuccess, `${mail}:${pass}:${resultAction}\n`);
  } else {
    fs.appendFileSync(outfail, `${mail}:${pass}\n`);
  }
  try {
    if (browser) {
      await browser.close();
    }
  } catch (error) {
    console.log(error);
  }
}

function isFileExists(pathFile) {
  const check = fs.pathExistsSync(pathFile);
  if (!check) return pathFile;
  return false;
}

ipc.on('start', async function (event, pathFileMail, soluong) {
  let pathFolder = `${__dirname}\\..\\extraResources\\MsTeams`;
  electron.session.defaultSession.clearCache();
  numberOfThread = Number(soluong);
  let incompleteFolder = isFileExists(pathFolder);
  if (incompleteFolder) {
    fs.mkdirSync(pathFolder);
    incompleteFolder = isFileExists(pathFolder);
  }
  let incompleteFile1 = isFileExists(pathFileMail);
  if (incompleteFolder || incompleteFile1) {
    win.webContents.send('checkfiles', incompleteFolder || incompleteFile1);
    return;
  }
  win.webContents.send('disable', true);
  flagPause = false;
  let listMailPass = fs.readFileSync(pathFileMail, 'utf8');
  listMailPass = listMailPass.split(/\r?\n/);

  let startTime = 0;
  interval = setInterval(() => {
    startTime++;
    win.webContents.send('time', startTime);
  }, 1000);


  listMailPass = listMailPass.slice(currentIndex);
  let listChunkMailRun = splitArrayIntoChunks(listMailPass, numberOfThread);
  let promises = [];
  for (let thread = 0; thread < listChunkMailRun.length; thread++) {
    const mailChunk = listChunkMailRun[thread];
    promises.push((async () => {
      for (const mailInfo of mailChunk) {
        try {
          if (flagPause) {
            return;
          }
          currentIndex++;
          win.webContents.send('total', currentIndex);
          await run(thread, mailInfo);
        } catch (err) {
          console.log(err);
        }
      }
    })())
  }
  await Promise.allSettled(promises);
  win.webContents.send('done', true);
  win.webContents.send('disable', false);
})

ipc.on('pause', async function (event) {
  flagPause = true;
  if (interval) {
    clearInterval(interval)
  }
  win.webContents.send('pause', "Đang tạm dừng...Vui lòng chờ...", true);
})

ipc.on('result', function (event, pathFileMail) {
  let outsuccess = `${__dirname}\\..\\extraResources\\MsTeams\\success.txt`;
  let outfail = `${__dirname}\\..\\extraResources\\MsTeams\\fail.txt`;
  let incompleteFile1 = isFileExists(pathFileMail);
  let incompleteFileSuccess = isFileExists(outsuccess);
  let incompleteFileFail = isFileExists(outfail);
  if (incompleteFile1) {
    win.webContents.send('checkfiles', incompleteFile1);
    return;
  }
  let listMail = fs.readFileSync(pathFileMail, 'utf8');
  listMail = listMail.split(/\r?\n/);
  if (!incompleteFileSuccess) {
    let listMailSuccess = fs.readFileSync(outsuccess, 'utf8');
    listMailSuccess = listMailSuccess.split(/\r?\n/);
    // remove all mail success
    for (const maildata of listMailSuccess) {
      let mail = maildata.split('|')?.[0];
      let indexMail = listMail.findIndex(m => m == mail);
      if (indexMail >= 0) {
        listMail = [...listMail.slice(0, indexMail), ...listMail.slice(indexMail + 1)];
      }
    }
  }

  if (!incompleteFileFail) {
    let listMailFail = fs.readFileSync(outfail, 'utf8');
    listMailFail = listMailFail.split(/\r?\n/);
  
    // remove all mail fail
    for (const maildata of listMailFail) {
      let mail = maildata.split('|')?.[0];
      let indexMail = listMail.findIndex(m => m == mail);
      if (indexMail >= 0) {
        listMail = [...listMail.slice(0, indexMail), ...listMail.slice(indexMail + 1)];
      }
    }
  }
  
  fs.writeFileSync(pathFileMail, listMail.join('\n') + "\n", 'utf8');
  win.webContents.send('result', true);
})