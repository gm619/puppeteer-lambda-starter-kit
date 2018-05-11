const setup = require('./starter-kit/setup');

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  exports.run(browser).then(
    (result) => callback(null, result)
  ).catch(
    (err) => callback(err)
  );
};

exports.run = async (browser) => {
  const page = await browser.newPage();
  await page.goto('http://www.apmterminals.com/operations/north-america/los-angeles');
  await page.click('.availability textarea');
  await page.keyboard.type('MSKU6838193');
  // await page.screenshot({ path: "terminal.png" });
  await page.click('.availability input[type=submit]');

  // await page.waitForNavigation({ waitUntil: 'networkidle0' });
  // await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0});

  const data = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        '.track-trace-results .results-wrapper table tr td'
        ))
    .map((td) => td.textContent);
  });

  console.log('the data', data);

/* screenshot
  await page.screenshot({path: '/tmp/screenshot.png'});
  const aws = require('aws-sdk');
  const s3 = new aws.S3({apiVersion: '2006-03-01'});
  const fs = require('fs');
  const screenshot = await new Promise((resolve, reject) => {
    fs.readFile('/tmp/screenshot.png', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
  await s3.putObject({
    Bucket: '<bucket name>',
    Key: 'screenshot.png',
    Body: screenshot,
  }).promise();
*/

  // cookie and localStorage
  await page.setCookie({name: 'name', value: 'cookieValue'});
  console.log(await page.cookies());
  console.log(await page.evaluate(() => {
    localStorage.setItem('name', 'localStorageValue');
    return localStorage.getItem('name');
  }));
  await page.close();
  return 'done';
};
