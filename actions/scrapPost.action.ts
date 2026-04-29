// // lib/scraper.ts
import puppeteer from "puppeteer-core";
export async function scrapeRedditPost(url: string, sortType: string = "Top") {
  const isProd = process.env.NODE_ENV === "production";
  const sortingMethod = `?sort=${sortType}`;
  const token = process.env.BROWSERLESS_TOKEN;

  // ADDED: &--disable-notifications and more stealth flags
  // const browserWSEndpoint = `wss://chrome.browserless.io?token=${token}&stealth&--window-size=1920,1080&--disable-notifications`;

  let browser;
  const targetUrl = (url + sortingMethod).replace(
    "www.reddit.com",
    "new.reddit.com",
  );
  try {
    browser = isProd
      ? await puppeteer.connect({
          browserWSEndpoint: `wss://chrome.browserless.io?token=${token}&stealth&--disable-blink-features=AutomationControlled&--window-size=1920,1080`,
        })
      : await puppeteer.launch({
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          headless: "shell",
          args: ["--no-sandbox"],
        });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Use a very specific, modern User Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    );

    await page.setCookie({
      name: "reddit_session",
      value: process.env.REDDIT_SESSION_COOKIE!, // Store this in .env
      domain: ".reddit.com",
    });

    // NAVIGATION
    console.log(targetUrl, "target");
    const response = await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Check if we got blocked (403) or redirected to login
    if (response?.status() === 403) {
      throw new Error(
        "Reddit blocked the request (403 Forbidden). Try adding a proxy.",
      );
    }

    // EXTRA TIME: Reddit's Shreddit UI is heavy
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // SCRAPING LOGIC
    const data = await page.evaluate(() => {
      // Helper to find text inside Shadow DOM or regular DOM
      const getVal = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? (el as any).innerText || (el as any).textContent : null;
      };

      // Reddit titles are often in shreddit-post or h1[slot="title"]
      const title =
        getVal('h1[slot="title"]') ||
        getVal("shreddit-post h1") ||
        document.title;

      // Description is tricky in Shreddit
      const description =
        getVal('div[slot="text-body"]') ||
        getVal("#post-content") ||
        getVal(".text-neutral-content");

      // Comments: depth="0" is critical to avoid sub-comments
      const commentElements = Array.from(
        document.querySelectorAll(
          'shreddit-comment[depth="0"] div[slot="comment"]',
        ),
      );
      const comments = commentElements
        .slice(0, 3)
        .map((el) => (el as HTMLElement).innerText.trim());

      return { title, description, comments };
    });

    return {
      title: data.title || "Untitled",
      description: (data.description || "").trim(),
      url,
      comment: data.comments || [],
    };
  } catch (error) {
    console.error("Scraper Error:", error);
    throw error;
  } finally {
    if (browser) {
      isProd ? await browser.disconnect() : await browser.close();
    }
  }
}

// import puppeteer from "puppeteer-core";
// // import chromium from "@sparticuz/chromium-min";

// export async function scrapeRedditPost(url: string, sortType: string = "Top") {
//   const isProd = process.env.NODE_ENV === "production";
//   const sortingMethod = `?sort=${sortType}`;
//   const token = process.env.BROWSERLESS_TOKEN;
//   const browserWSEndpoint = `wss://chrome.browserless.io?token=${token}&stealth&--window-size=1920,1080&blockAds`;
//   let browser;

//   try {
//     if (isProd) {
//       browser = await puppeteer.connect({
//         browserWSEndpoint: browserWSEndpoint,
//       });
//     } else {
//       browser = await puppeteer.launch({
//         executablePath:
//           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//         headless: "shell",
//         args: ["--no-sandbox"],
//       });
//     }

//     console.log(url, "url");

//     const page = await browser.newPage();

//     // SET VIEWPORT: Important for responsive elements
//     await page.setViewport({ width: 1920, height: 1080 });

//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
//     );

//     // Use networkidle2 to ensure comments are loaded
//     await page.goto(url + sortingMethod, {
//       waitUntil: "networkidle2",
//       timeout: 60000,
//     });

//     // Added a small "human" delay to let the shadow DOM settle
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // Wait specifically for the core content
//     await page
//       .waitForSelector('h1[slot="title"]', { timeout: 10000 })
//       .catch(() => null);

//     const title = await page
//       .$eval('h1[slot="title"]', (el) => (el as HTMLElement).innerText)
//       .catch(() => "Untitled");
//     console.log(title, "title");

//     // Description can sometimes be inside a 'shreddit-post' tag
//     const description = await page
//       .$eval(
//         'div[slot="text-body"], #post-content',
//         (el) => (el as HTMLElement).innerText,
//       )
//       .catch(() => "");
//     console.log(description, "description");

//     // Refined comment selector: Sometimes 'depth="0"' isn't ready immediately
//     const mainComments = await page
//       .$$eval('shreddit-comment div[slot="comment"]', (elements) =>
//         elements.slice(0, 3).map((el) => (el as HTMLElement).innerText.trim()),
//       )
//       .catch(() => []);

//     console.log(mainComments, "mainComments");

//     return {
//       title,
//       description: description.trim(),
//       url,
//       comment: mainComments,
//     };
//   } catch (error) {
//     console.error("Scraper Error:", error);
//     throw error;
//   } finally {
//     if (browser) {
//       isProd ? await browser.disconnect() : await browser.close();
//     }
//   }
// }

// // export async function scrapeRedditPost(url: string, sortType: string = "Top") {
// //   const isProd = process.env.NODE_ENV === "production";
// //   const sortingMethod = `?sort=${sortType}`;
// //   let browser;

// //   try {
// //     // 1. Resolve the path separately
// //     if (isProd) {
// //       // Connect to Browserless in Production
// //       // No local binaries, no libnss3 errors
// //       browser = await puppeteer.connect({
// //         browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
// //       });
// //     } else {
// //       // Local development: Use your Mac's installed Chrome
// //       browser = await puppeteer.launch({
// //         executablePath:
// //           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
// //         headless: "shell",
// //         args: ["--no-sandbox"],
// //       });
// //     }

// //     const page = await browser.newPage();
// //     await page.setUserAgent(
// //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
// //     );

// //     // 2. Navigation with a reasonable timeout for Serverless
// //     await page.goto(url + sortingMethod, {
// //       waitUntil: "domcontentloaded",
// //       timeout: 30000,
// //     });

// //     // 3. Resilient Selectors
// //     // We use Promise.allSettled or individual try/catches so one missing element doesn't kill the job
// //     await Promise.allSettled([
// //       page.waitForSelector('h1[slot="title"]', { timeout: 8000 }),
// //       page.waitForSelector('div[slot="text-body"]', { timeout: 8000 }),
// //       page.waitForSelector('div[slot="comment"]', { timeout: 8000 }),
// //     ]);

// //     const title = await page
// //       .$eval('h1[slot="title"]', (el) => (el as HTMLElement).innerText)
// //       .catch(() => "Untitled");
// //     const description = await page
// //       .$eval('div[slot="text-body"]', (el) => (el as HTMLElement).innerText)
// //       .catch(() => "");

// //     const mainComments = await page
// //       .$$eval('shreddit-comment[depth="0"] div[slot="comment"]', (elements) =>
// //         elements.slice(0, 3).map((el) => (el as HTMLElement).innerText.trim()),
// //       )
// //       .catch(() => []);

// //     // 4. Return the data
// //     return {
// //       title,
// //       description: description.trim(),
// //       url,
// //       comment: mainComments,
// //     };
// //   } catch (error) {
// //     console.error("Scraper encountered an error:", error);
// //     throw error; // Re-throw for Inngest retry logic
// //   } finally {
// //     // 5. THE MOST IMPORTANT PART: Always close the browser in finally
// //     if (browser) {
// //       await browser.close();
// //     }
// //   }
// // }

// // export async function scrapeRedditPost(url: string, sortType: string = "Top") {
// //   const sortingMethod = `?sort=${sortType}`;

// //   const isProd = process.env.NODE_ENV === "production";
// //   let browser;
// //   // console.log(url + sortingMethod);

// //   // const viewport = {
// //   //   deviceScaleFactor: 1,
// //   //   hasTouch: false,
// //   //   height: 1080,
// //   //   isLandscape: true,
// //   //   isMobile: false,
// //   //   width: 1920,
// //   // };

// //   // const browser = await puppeteer.launch({
// //   //   args: puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
// //   //   defaultViewport: viewport,
// //   //   executablePath: await chromium.executablePath(),
// //   // });

// //   // 1. Manually define the viewport to avoid the .defaultViewport error
// //   const myViewport = {
// //     width: 1280,
// //     height: 720,
// //     deviceScaleFactor: 1,
// //   };

// //   browser = await puppeteer.launch({
// //     // 2. Use a fallback for args
// //     args: isProd ? chromium.args : ["--no-sandbox", "--disable-setuid-sandbox"],

// //     // Use your manual viewport instead of chromium.defaultViewport
// //     defaultViewport: isProd ? (chromium as any).defaultViewport : myViewport,

// //     // 3. Cast to 'any' if .executablePath or .headless are being stubborn
// //     executablePath: isProd
// //       ? await chromium.executablePath()
// //       : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",

// //     // 4. Fallback for headless: 'shell' is often better for performance
// //     headless: isProd ? (chromium as any).headless : "shell",
// //   });

// //   const page = await browser.newPage();
// //   await page.setUserAgent(
// //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
// //   );
// //   console.log(url, "url");
// //   await page.goto(url + sortingMethod, { waitUntil: "domcontentloaded" });

// //   // ... your selector logic ...

// //   const titleSelector = await page.waitForSelector('h1[slot="title"]', {
// //     visible: true,
// //     timeout: 10000,
// //   });

// //   const bodySelector = await page.waitForSelector('div[slot="text-body"]', {
// //     visible: true,
// //     timeout: 10000,
// //   });

// //   const commentSlot = await page.waitForSelector('div[slot="comment"]', {
// //     visible: true,
// //     timeout: 10000,
// //   });

// //   // if (!titleSelector || !bodySelector) {
// //   //   return;
// //   // }

// //   const title = await page.$eval('h1[slot="title"]', (el) => el.innerText);
// //   const description = await page.$eval(
// //     'div[slot="text-body"]',
// //     (el) => el.innerText,
// //   );

// //   // const comment = await page.$$eval('div[slot="comment"]', (el) => {
// //   //   return el.map((each) => each.innerText);
// //   // });

// //   const mainComments = await page.$$eval(
// //     'shreddit-comment[depth="0"] div[slot="comment"]',
// //     (elements) => {
// //       return elements
// //         .slice(0, 3) // Get the first 3 main comments
// //         .map((el) => (el as HTMLElement).innerText.trim());
// //     },
// //   );
// //   await browser.close(); // Critical!

// //   // console.log(comment.map((each) => each.split("/n")));
// //   // console.log(mainComments);
// //   return {
// //     title,
// //     description: description.trim(),
// //     url,
// //     comment: mainComments,
// //   };
// // }
