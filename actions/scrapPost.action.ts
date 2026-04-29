// lib/scraper.ts

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export async function scrapeRedditPost(url: string, sortType: string = "Top") {
  const isProd = process.env.NODE_ENV === "production";
  const sortingMethod = `?sort=${sortType}`;
  let browser;

  try {
    // 1. Launch with explicit configuration
    browser = await puppeteer.launch({
      args: isProd
        ? chromium.args
        : ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: isProd
        ? (chromium as any).defaultViewport
        : { width: 1280, height: 720 },
      executablePath: isProd
        ? await chromium.executablePath()
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: isProd ? (chromium as any).headless : "shell",
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // 2. Navigation with a reasonable timeout for Serverless
    await page.goto(url + sortingMethod, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // 3. Resilient Selectors
    // We use Promise.allSettled or individual try/catches so one missing element doesn't kill the job
    await Promise.allSettled([
      page.waitForSelector('h1[slot="title"]', { timeout: 8000 }),
      page.waitForSelector('div[slot="text-body"]', { timeout: 8000 }),
      page.waitForSelector('div[slot="comment"]', { timeout: 8000 }),
    ]);

    const title = await page
      .$eval('h1[slot="title"]', (el) => (el as HTMLElement).innerText)
      .catch(() => "Untitled");
    const description = await page
      .$eval('div[slot="text-body"]', (el) => (el as HTMLElement).innerText)
      .catch(() => "");

    const mainComments = await page
      .$$eval('shreddit-comment[depth="0"] div[slot="comment"]', (elements) =>
        elements.slice(0, 3).map((el) => (el as HTMLElement).innerText.trim()),
      )
      .catch(() => []);

    // 4. Return the data
    return {
      title,
      description: description.trim(),
      url,
      comment: mainComments,
    };
  } catch (error) {
    console.error("Scraper encountered an error:", error);
    throw error; // Re-throw for Inngest retry logic
  } finally {
    // 5. THE MOST IMPORTANT PART: Always close the browser in finally
    if (browser) {
      await browser.close();
    }
  }
}

// export async function scrapeRedditPost(url: string, sortType: string = "Top") {
//   const sortingMethod = `?sort=${sortType}`;

//   const isProd = process.env.NODE_ENV === "production";
//   let browser;
//   // console.log(url + sortingMethod);

//   // const viewport = {
//   //   deviceScaleFactor: 1,
//   //   hasTouch: false,
//   //   height: 1080,
//   //   isLandscape: true,
//   //   isMobile: false,
//   //   width: 1920,
//   // };

//   // const browser = await puppeteer.launch({
//   //   args: puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
//   //   defaultViewport: viewport,
//   //   executablePath: await chromium.executablePath(),
//   // });

//   // 1. Manually define the viewport to avoid the .defaultViewport error
//   const myViewport = {
//     width: 1280,
//     height: 720,
//     deviceScaleFactor: 1,
//   };

//   browser = await puppeteer.launch({
//     // 2. Use a fallback for args
//     args: isProd ? chromium.args : ["--no-sandbox", "--disable-setuid-sandbox"],

//     // Use your manual viewport instead of chromium.defaultViewport
//     defaultViewport: isProd ? (chromium as any).defaultViewport : myViewport,

//     // 3. Cast to 'any' if .executablePath or .headless are being stubborn
//     executablePath: isProd
//       ? await chromium.executablePath()
//       : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",

//     // 4. Fallback for headless: 'shell' is often better for performance
//     headless: isProd ? (chromium as any).headless : "shell",
//   });

//   const page = await browser.newPage();
//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//   );
//   console.log(url, "url");
//   await page.goto(url + sortingMethod, { waitUntil: "domcontentloaded" });

//   // ... your selector logic ...

//   const titleSelector = await page.waitForSelector('h1[slot="title"]', {
//     visible: true,
//     timeout: 10000,
//   });

//   const bodySelector = await page.waitForSelector('div[slot="text-body"]', {
//     visible: true,
//     timeout: 10000,
//   });

//   const commentSlot = await page.waitForSelector('div[slot="comment"]', {
//     visible: true,
//     timeout: 10000,
//   });

//   // if (!titleSelector || !bodySelector) {
//   //   return;
//   // }

//   const title = await page.$eval('h1[slot="title"]', (el) => el.innerText);
//   const description = await page.$eval(
//     'div[slot="text-body"]',
//     (el) => el.innerText,
//   );

//   // const comment = await page.$$eval('div[slot="comment"]', (el) => {
//   //   return el.map((each) => each.innerText);
//   // });

//   const mainComments = await page.$$eval(
//     'shreddit-comment[depth="0"] div[slot="comment"]',
//     (elements) => {
//       return elements
//         .slice(0, 3) // Get the first 3 main comments
//         .map((el) => (el as HTMLElement).innerText.trim());
//     },
//   );
//   await browser.close(); // Critical!

//   // console.log(comment.map((each) => each.split("/n")));
//   // console.log(mainComments);
//   return {
//     title,
//     description: description.trim(),
//     url,
//     comment: mainComments,
//   };
// }
