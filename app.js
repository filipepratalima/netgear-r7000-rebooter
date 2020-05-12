require('dotenv').config();
const puppeteer = require('puppeteer');

const ADVANCED_FRAME_URL = 'ADVANCED_home.htm';
const SELECTOR_PAGE_TABLE = '#page-table1';
const SELECTOR_PAGE_TABLE_BUTTON = '.page-table-button-left';
const TIMER_INTERVAL = 60000;

const scheduledTime = process.env.SCHEDULED_DAILY_REBOOT_TIME;
const [sc_hour, sc_minutes] = scheduledTime.split(':');

const flags = process.argv.filter((arg) => arg.startsWith('--'));
const __DEBUG__ = flags.includes('--debug');

/**
 * Check set schedule
 */
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
      waitUntil: 'networkidle2',
    });

    // select `Reboot` button and accept
    await page.waitForSelector(SELECTOR_PAGE_TABLE);
    const buttonReboot = await page.$(SELECTOR_PAGE_TABLE_BUTTON);
    page.on('dialog', async (dialog) => {
      if (__DEBUG__) {
        console.log(`[__DEBUG__]: ${dialog.message()}`);
        await dialog.dismiss();
      } else {
        await dialog.accept();
      }

      // end
      await browser.close();

      console.log(`[SUCCESS] Rebooted router ${new Date()}`);
    });
    await buttonReboot.click().catch((e) => { });
  } catch (e) {
    console.error(e);
  }
};

(async () => {
  try {
    console.log(`${__DEBUG__ ? '[__DEBUG__]: ' : ''}Scheduled router reboot daily at: ${sc_hour}:${sc_minutes}`);
    intervalId = setInterval(() => checkTime(rebootRouter), TIMER_INTERVAL);
  } catch (e) {
    clearInterval(intervalId);
    console.error(e);
  }
})();
