const express = require('express');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000 if not set in .env

app.get('/book-ticket', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Set viewport to desktop dimensions
    await page.setViewport({ width: 1920, height: 1080 });

    // Set user agent to a desktop browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36');

    // Open IRCTC train search page and wait until the network is idle to ensure full page load
    await page.goto('https://www.irctc.co.in/nget/train-search', { waitUntil: 'networkidle2' });

    // Close any pop-up or banner if present
    try {
      await page.waitForSelector('#disha-banner-close', { visible: true });
      await page.click('#disha-banner-close');
    } catch (error) {
      console.log('No banner present.');
    }


    // Qauta selection
     await page.waitForSelector('div.ui-dropdown-trigger', { visible: true });
     await page.click('.ng-tns-c65-12');
     await page.click('li[aria-label="TATKAL"]');

    // Click on login button
    await page.waitForSelector('a[aria-label="Click here to Login in application"]', { visible: true });
    await page.click('a[aria-label="Click here to Login in application"]');

    // Wait for login modal to appear
    await page.waitForSelector('input[placeholder="User Name"]', { visible: true });

    // Login to IRCTC
    await page.type('input[placeholder="User Name"]', process.env.USER_ID);
    await page.type('input[placeholder="Password"]', process.env.USER_PASSWORD);
    
    // Handle captcha manually or with a service
    // console.log('Please enter the captcha manually...');
    // await page.waitForTimeout(30000); // Wait for 30 seconds to enter captcha manually

    // Click the login button inside the modal
    // await page.waitForSelector('button[type="submit"]', { visible: true });
    // await page.click('button[type="submit"]');

    // Wait for navigation to the train search page after login
    // await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Logout
    // await page.waitForSelector('a[aria-label="Click here Logout from application"]', { visible: true });
    // await page.click('a[aria-label="Click here Logout from application"]', { visible: true });

    // Fill in train search details

    // Wait and select option from the autocomplete list
    // Wait and select option from the autocomplete list
    await page.waitForSelector('.ui-dropdown-trigger', { visible: true });
    await page.click('.ui-dropdown-trigger'); // Adjust this if needed based on the available options

    // Fill destination
    await page.waitForSelector('input[aria-controls="pr_id_1_list"]', { visible: true });
    await page.type('input[aria-controls="pr_id_1_list"]', 'MGR CHENNAI CTL - MAS (CHENNAI)');

    await page.waitForSelector('input[aria-controls="pr_id_2_list"]', { visible: true });
    await page.type('input[aria-controls="pr_id_2_list"]', 'NAMAKKAL - NMKL');

    await page.waitForSelector('aria-label="Enter Journey Date. Formate D.D./.M.M./.Y.Y.Y.Y. Input is Mandatory."', { visible: true });
    await page.click('aria-label="Enter Journey Date. Formate D.D./.M.M./.Y.Y.Y.Y. Input is Mandatory."');
    
    await page.type('data-gtm-form-interact-field-id="5"', '10-09-2024'); // Enter date in required format
    await page.keyboard.press('Enter');
    
    // Wait and select option from the autocomplete list
    await page.waitForSelector('li.ui-menu-item', { visible: true });
    await page.click('li.ui-menu-item'); // Adjust this if needed based on the available options

    // Click on the dropdown to open it
    await page.waitForSelector('div[aria-label="GENERAL"]', { visible: true });
    await page.click('div[aria-label="GENERAL"]');

    // Wait for the dropdown options to appear
    await page.waitForSelector('li[aria-label="LADIES"]', { visible: true });

    // Select the option from the dropdown
    await page.click('li[aria-label="LADIES"]');

    await page.waitForSelector('li.ui-menu-item', { visible: true });
    await page.click('li.ui-menu-item'); // Adjust this if needed based on the available options

    await page.waitForSelector('input[aria-controls="pr_id_3_list"]', { visible: true });
    await page.type('input[aria-controls="pr_id_3_list"]', 'MGR CHENNAI CTL - MAS (CHENNAI)');
    
    await page.waitForSelector('input[aria-controls="pr_id_4_list"]', { visible: true });
    await page.type('input[aria-controls="pr_id_4_list"]', 'NAMAKKAL - NMKL');

    await page.type('#journeyDate', 'DD-MM-YYYY'); // Enter date in required format
    await page.keyboard.press('Enter');

    // Wait for train selection options to appear and interact
    await page.waitForTimeout(5000); // Adjust based on page load times

    // Fill in passenger details
    await page.waitForSelector('#psgn-name', { visible: true });
    await page.type('#psgn-name', 'Passenger Name');
    await page.type('#psgn-age', '30');
    await page.select('#psgn-gender', 'M'); // Assuming the gender field is a dropdown

    // Add more passenger details if necessary
    // Repeat the above steps for additional passengers

    // Submit the form
    await page.click('.psgn-addbtn'); // Adjust selector based on actual button

    // Handle payment if needed
    // This will require additional automation steps based on payment gateway

    // Close the browser
    await page.waitForTimeout(5000); // Adjust based on page load times
    await browser.close();

    res.send('Ticket booking automation complete!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during the automation process.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});