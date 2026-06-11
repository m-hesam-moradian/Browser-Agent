import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

/**
 * Requirement 1: Use puppeteer-extra and stealth plugin
 * The stealth plugin helps evade bot detection by masking puppeteer-specific properties.
 */
puppeteer.use(StealthPlugin());

(async () => {
  /**
   * Requirement 2: Browser Configuration (Existing Profile)
   *
   * IMPORTANT:
   * 1. Replace <Username> with your Windows account name.
   * 2. If you are using a specific Chrome profile (like "Profile 1"), append it to the path.
   *    Default is usually: C:\Users\<Username>\AppData\Local\Google\Chrome\User Data
   * 3. Ensure all Chrome instances are CLOSED before running this script, or use a separate profile directory,
   *    as Chrome only allows one process to use a 'userDataDir' at a time.
   */
  const userDataDir =
    "C:\\Users\\Sam\\AppData\\Local\\Google\\Chrome\\User Data";

  /**
   * Default executable path for Chrome on Windows.
   * If using Edge, change to: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
   */
  const executablePath =
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  console.log("Launching browser with existing profile...");

  try {
    const browser = await puppeteer.launch({
      // Requirement 2: Set headless: false for visibility
      headless: false,
      executablePath: executablePath,
      userDataDir: userDataDir,
      // Requirement 2: Ensure it looks like a normal user window
      defaultViewport: null,
      args: ["--start-maximized"],
    });

    console.log("Navigating to Google AI Studio...");

    // Get the initial page or create a new one
    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    // Requirement 3: Navigate to Google AI Studio and wait for load
    await page.goto("https://aistudio.google.com/", {
      waitUntil: "networkidle2",
    });

    console.log("Navigation complete. Page loaded successfully.");
    console.log(
      "Browser is kept open for inspection. Close this terminal or press Ctrl+C to terminate.",
    );

    /**
     * Requirement 3: Do NOT close the browser automatically.
     * This allows the user to inspect the state and confirm it worked.
     */
  } catch (error) {
    console.error("An error occurred:", error);

    if (error.message.includes("EBUSY") || error.message.includes("lock")) {
      console.warn(
        "\nTIP: Chrome might still be running. Close all Chrome windows or specify a different profile.",
      );
    }
  }
})();
