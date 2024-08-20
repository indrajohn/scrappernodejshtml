const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    const html = await page.content();

    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Error fetching page content');
  }
};
