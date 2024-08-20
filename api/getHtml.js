const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  let browser = null;

  try {
    console.log(`Fetching URL: ${url}`);

    // Launch the browser using @sparticuz/chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000, // Optional: Increase timeout if necessary
    });

    console.log('Page loaded successfully');

    const html = await page.content();
    console.log('HTML content retrieved');

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).send('Error fetching page content');
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
