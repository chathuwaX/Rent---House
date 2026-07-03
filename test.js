const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
    
    // Use the absolute path to the HTML file
    const url = 'file:///D:/this%20folder%20only%20use%20antigravity/Rent---House/public/house-details.html?id=1';
    console.log('Navigating to', url);
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    console.log('Page loaded successfully');
    
    await browser.close();
})();
