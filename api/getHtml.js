const playwright = require('playwright-aws-lambda');

module.exports = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  let browser = null;

  try {
    console.log(`Fetching URL: ${url}`);

    // Launch the browser using playwright-aws-lambda
    browser = await playwright.launchChromium({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle',
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
