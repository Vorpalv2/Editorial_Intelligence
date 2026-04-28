// lib/scraper.ts
import puppeteer from "puppeteer";

export async function scrapeRedditPost(url: string, sortType: string = "Top") {
  const sortingMethod = `?sort=${sortType}`;
  // console.log(url + sortingMethod);

  const browser = await puppeteer.launch({
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
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );
  console.log(url, "url");
  await page.goto(url + sortingMethod, { waitUntil: "domcontentloaded" });

  // ... your selector logic ...

  const titleSelector = await page.waitForSelector('h1[slot="title"]', {
    visible: true,
    timeout: 10000,
  });

  const bodySelector = await page.waitForSelector('div[slot="text-body"]', {
    visible: true,
    timeout: 10000,
  });

  const commentSlot = await page.waitForSelector('div[slot="comment"]', {
    visible: true,
    timeout: 10000,
  });

  if (!titleSelector || !bodySelector) {
    return;
  }

  const title = await page.$eval('h1[slot="title"]', (el) => el.innerText);
  const description = await page.$eval(
    'div[slot="text-body"]',
    (el) => el.innerText,
  );

  // const comment = await page.$$eval('div[slot="comment"]', (el) => {
  //   return el.map((each) => each.innerText);
  // });

  const mainComments = await page.$$eval(
    'shreddit-comment[depth="0"] div[slot="comment"]',
    (elements) => {
      return elements
        .slice(0, 3) // Get the first 3 main comments
        .map((el) => (el as HTMLElement).innerText.trim());
    },
  );

  // console.log(comment.map((each) => each.split("/n")));
  // console.log(mainComments);
  return {
    title,
    description: description.trim(),
    url,
    comment: mainComments,
  };

  await browser.close(); // Critical!
}
