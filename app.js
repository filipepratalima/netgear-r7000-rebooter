require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const ADVANCED_FRAME_URL = "ADVANCED_home.htm";
const SELECTOR_PAGE_TABLE = "#page-table1";
const SELECTOR_PAGE_TABLE_BUTTON = ".page-table-button-left";
const TIMER_INTERVAL = 60000;

const scheduledTime = process.env.SCHEDULED_DAILY_REBOOT_TIME;
const [sc_hour, sc_minutes] = scheduledTime.split(":");

let intervalId = 0;
const checkTime = async (cb) => {
  const now = new Date();
  if (
    now.getHours() === Number(sc_hour) &&
    now.getMinutes() === Number(sc_minutes)
  ) {
    cb();
  }
};

/**
 * Reboot action
 */
const rebootRouter = async () => {
  try {
    // init browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // authenticate
    await page.authenticate({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    });
    await page.goto(`${process.env.ADMIN_WEB_URL}/${ADVANCED_FRAME_URL}`, {
      waitUntil: "networkidle2",
    });

    // select `Reboot` button and accept
    await page.waitForSelector(SELECTOR_PAGE_TABLE);
    const buttonReboot = await page.$(SELECTOR_PAGE_TABLE_BUTTON);
    page.on("dialog", async (dialog) => {
      console.log(dialog.message());
      await dialog.accept();

      // end
      await browser.close();

      writeLog(true);
    });
    await buttonReboot.click().catch((e) => {});
  } catch (e) {
    console.log(e);
    writeLog(false, e.message);
  }
};

/**
 * Write to log.txt
 * @param {boolean} isSuccess
 * @param {string} errorMessage
 */
const writeLog = (isSuccess, errorMessage) => {
  const msg_success = `[SUCCESS] Rebooted router ${new Date()}\n`;
  const msg_fail = `[FAIL] Rebooted router ${new Date()}\n${errorMessage}\n`;

  fs.writeFile("log.txt", isSuccess ? msg_success : msg_fail, (err) => {
    if (err) return console.log(err);
  });
};

(async () => {
  try {
    console.log(`Scheduled router reboot daily at: ${sc_hour}:${sc_minutes}`);
    intervalId = setInterval(() => checkTime(rebootRouter), TIMER_INTERVAL);
  } catch (e) {
    clearInterval(intervalId);
    console.log(e);
  }
})();
