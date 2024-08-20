module.exports = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    console.log(`Fetching URL: ${url}`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000, // Optional: Increase timeout
    });
    console.log('Page loaded successfully');

    const html = await page.content();
    console.log('HTML content retrieved');

    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).send('Error fetching page content');
  }
};
