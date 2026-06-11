import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Integrate the stealth plugin to evade bot detection
puppeteer.use(StealthPlugin());

(async () => {
  // IMPORTANT: Replace <Username> with your actual Windows username.
  // If you use a specific profile other than "Default", ensure it's properly handled or pointed to 
  // (e.g., 'C:\\Users\\<Username>\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1').
  const userDataDir = 'C:\\Users\\<Username>\\AppData\\Local\\Google\\Chrome\\User Data';

  // Default path to the Chrome executable on Windows
  // Note: Depending on your installation, it might be in 'Program Files (x86)' instead of 'Program Files'.
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  console.log('Launching browser with existing profile...');

  try {
    const browser = await puppeteer.launch({
      headless: false, // Make the browser window fully visible
      executablePath: executablePath,
      userDataDir: userDataDir,
      defaultViewport: null, // Let the viewport match the window size
      args: ['--start-maximized'], // Start the browser maximized
    });

    console.log('Navigating to Google AI Studio...');
    
    // Use the first open tab instead of creating a second one initially
    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    // Navigate to Google AI Studio and wait for the page to load completely
    await page.goto('https://aistudio.google.com/', {
      waitUntil: 'networkidle2',
    });

    console.log('Navigation complete. The page has fully loaded.');
    console.log('The browser will remain open for inspection. Press Ctrl+C in the terminal to exit the Node process.');

    // We do NOT call `browser.close()` here so you can manually inspect the state.

  } catch (error) {
    console.error('An error occurred during automation:', error);
    
    if (error.message.includes('EBUSY') || error.message.includes('lock')) {
      console.warn('\nNote: You might need to close your existing Chrome browser instances before running this script so Puppeteer can lock the user data directory.');
    }
  }
})();
