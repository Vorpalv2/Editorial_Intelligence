// actions/RefreshSummary.action.ts
"use server";

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function RefreshSummaryAction({
  url,
  sortingMethod = "?sort=Top",
}: {
  url: string;
  sortingMethod: string;
}) {
  const isProd = process.env.NODE_ENV === "production";
  let browser;

  try {
    // 1. Configure the browser for the environment
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

    // 2. Navigate to source
    const response = await page.goto(url + sortingMethod, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    if (!response || response.status() >= 400) {
      throw new Error(
        `Source URL is no longer reachable (Status: ${response?.status()})`,
      );
    }

    // 3. Content Validation Logic
    const isDeleted = await page.evaluate(() => {
      const bodyText = document.body.innerText.toLowerCase();
      return (
        bodyText.includes("post deleted") ||
        bodyText.includes("content no longer available") ||
        bodyText.includes("404 not found") ||
        bodyText.includes("sorry, this post was deleted")
      );
    });

    if (isDeleted) {
      throw new Error("The original content appears to have been removed.");
    }

    // 4. Resilient Selection
    // Wait for selectors but don't crash if optional elements (like body text) are missing
    await Promise.allSettled([
      page.waitForSelector('h1[slot="title"]', { timeout: 10000 }),
      page.waitForSelector('div[slot="text-body"]', { timeout: 10000 }),
      page.waitForSelector('div[slot="comment"]', { timeout: 10000 }),
    ]);

    const title = await page
      .$eval('h1[slot="title"]', (el) => (el as HTMLElement).innerText)
      .catch(() => "Untitled Post");
    const description = await page
      .$eval('div[slot="text-body"]', (el) => (el as HTMLElement).innerText)
      .catch(() => "");

    const mainComments = await page
      .$$eval('shreddit-comment[depth="0"] div[slot="comment"]', (elements) =>
        elements.slice(0, 3).map((el) => (el as HTMLElement).innerText.trim()),
      )
      .catch(() => []);

    return {
      title,
      description: description.trim(),
      url,
      comment: mainComments,
    };
  } catch (error: any) {
    console.error("Refresh Error:", error.message);
    throw new Error(error.message);
  } finally {
    // 5. CRITICAL: Always close the browser in the finally block
    if (browser) {
      await browser.close();
    }
  }
}

// "use server";

// import puppeteer from "puppeteer-core";

// export async function RefreshSummaryAction({
//   url,
//   sortingMethod = "Top",
// }: {
//   url: string;
//   sortingMethod: string;
// }) {
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--disable-accelerated-2d-canvas",
//         "--no-first-run",
//         "--no-zygote",
//         "--disable-gpu", // Vital for reducing CPU load
//       ],
//     });
//     const page = await browser.newPage();

//     // 1. Navigate to the source
//     const response = await page.goto(url + sortingMethod, {
//       waitUntil: "domcontentloaded",
//       timeout: 30000,
//     });

//     // 2. Initial Check: HTTP Status
//     if (!response || response.status() >= 400) {
//       throw new Error("Source URL is no longer reachable (404 or restricted).");
//     }

//     // 3. Deeper Check: Content Validation
//     // Some sites return 200 OK but show "Post Deleted" in the HTML
//     const isDeleted = await page.evaluate(() => {
//       const bodyText = document.body.innerText.toLowerCase();
//       return (
//         bodyText.includes("post deleted") ||
//         bodyText.includes("content no longer available") ||
//         bodyText.includes("404 not found") ||
//         bodyText.includes(
//           " Sorry, this post was deleted by the person who originally posted it. ",
//         )
//       );
//     });

//     if (isDeleted) {
//       throw new Error("The original content appears to have been removed.");
//     }

//     // 4. Trigger Re-summarization
//     // Since you already have the page open, you could extract the text
//     // here and pass it directly to your existing summarization logic

//     await page.waitForSelector('h1[slot="title"]', {
//       visible: true,
//       timeout: 10000,
//     });

//     await page.waitForSelector('div[slot="text-body"]', {
//       visible: true,
//       timeout: 10000,
//     });

//     await page.waitForSelector('div[slot="comment"]', {
//       visible: true,
//       timeout: 10000,
//     });

//     const title = await page.$eval('h1[slot="title"]', (el) => el.innerText);
//     const description = await page.$eval(
//       'div[slot="text-body"]',
//       (el) => el.innerText,
//     );
//     const mainComments = await page.$$eval(
//       'shreddit-comment[depth="0"] div[slot="comment"]',
//       (elements) => {
//         return elements
//           .slice(0, 3) // Get the first 3 main comments
//           .map((el) => (el as HTMLElement).innerText.trim());
//       },
//     );

//     return {
//       title,
//       description: description.trim(),
//       url,
//       comment: mainComments,
//     };
//   } catch (error: any) {
//     if (browser) await browser.close();
//     console.error("Refresh Error:", error.message);
//     throw new Error(error.message);
//   }
// }
