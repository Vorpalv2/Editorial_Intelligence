// actions/RefreshSummary.action.ts
"use server";

import puppeteer from "puppeteer";

export async function RefreshSummaryAction({
  url,
  sortingMethod = "Top",
}: {
  url: string;
  sortingMethod: string;
}) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu", // Vital for reducing CPU load
      ],
    });
    const page = await browser.newPage();

    // 1. Navigate to the source
    const response = await page.goto(url + sortingMethod, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // 2. Initial Check: HTTP Status
    if (!response || response.status() >= 400) {
      throw new Error("Source URL is no longer reachable (404 or restricted).");
    }

    // 3. Deeper Check: Content Validation
    // Some sites return 200 OK but show "Post Deleted" in the HTML
    const isDeleted = await page.evaluate(() => {
      const bodyText = document.body.innerText.toLowerCase();
      return (
        bodyText.includes("post deleted") ||
        bodyText.includes("content no longer available") ||
        bodyText.includes("404 not found") ||
        bodyText.includes(
          " Sorry, this post was deleted by the person who originally posted it. ",
        )
      );
    });

    if (isDeleted) {
      throw new Error("The original content appears to have been removed.");
    }

    // 4. Trigger Re-summarization
    // Since you already have the page open, you could extract the text
    // here and pass it directly to your existing summarization logic

    await page.waitForSelector('h1[slot="title"]', {
      visible: true,
      timeout: 10000,
    });

    await page.waitForSelector('div[slot="text-body"]', {
      visible: true,
      timeout: 10000,
    });

    await page.waitForSelector('div[slot="comment"]', {
      visible: true,
      timeout: 10000,
    });

    const title = await page.$eval('h1[slot="title"]', (el) => el.innerText);
    const description = await page.$eval(
      'div[slot="text-body"]',
      (el) => el.innerText,
    );
    const mainComments = await page.$$eval(
      'shreddit-comment[depth="0"] div[slot="comment"]',
      (elements) => {
        return elements
          .slice(0, 3) // Get the first 3 main comments
          .map((el) => (el as HTMLElement).innerText.trim());
      },
    );

    return {
      title,
      description: description.trim(),
      url,
      comment: mainComments,
    };
  } catch (error: any) {
    if (browser) await browser.close();
    console.error("Refresh Error:", error.message);
    throw new Error(error.message);
  }
}
