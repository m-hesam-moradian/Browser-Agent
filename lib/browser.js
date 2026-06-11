import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// 1. Architecture & Plugins: Integrate puppeteer-extra-plugin-stealth to evade bot detection
puppeteer.use(StealthPlugin());

export async function launchBrowser() {
  // 2. Browser Configuration (Dedicated Automation Profile):
  // - Using a separate folder avoids conflicts with your main Chrome session, allowing both to run at the same time.
  // - The first time this script runs, sign in to your Google account in the opened window.
  // - Because this folder is persistent, Chrome will save your login state and remember it for all future runs.
  const userDataDir = "C:\\Users\\Sam\\AppData\\Local\\Google\\Chrome\\User Data Automation";
  // - Use the system's existing Chrome installation by specifying the default executablePath for Windows.
  // - Update this path if Chrome is installed in another location (e.g., Program Files (x86)) or to use Microsoft Edge.
  // - Chrome Default: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  // - Chrome (32-bit): "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  // - Edge Default: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  console.log("Launching browser with the following configuration:");
  console.log(`- Executable Path: ${executablePath}`);
  console.log(`- User Data Dir: ${userDataDir}`);

  try {
    const browser = await puppeteer.launch({
      // Set headless: false so the browser window is fully visible for tracking
      headless: false,

      // Use the specified executable path and existing user profile directory
      executablePath: executablePath,
      userDataDir: userDataDir,

      // Pass defaultViewport: null and launch argument '--start-maximized' to look like a normal user window
      defaultViewport: null,
      args: [
        "--start-maximized",
        // OPTIONAL: If you want to load a specific profile (e.g., "Profile 1"), uncomment the line below:
        // "--profile-directory=Profile 1"
      ],
    });

    console.log("Browser launched successfully.");

    // 3. Automation Workflow:
    // Get the first active page or open a new one
    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    console.log("Navigating to Google AI Studio...");

    // Navigate and wait for the page to load completely (networkidle2)
    await page.goto("https://aistudio.google.com/", {
      waitUntil: "networkidle2",
    });

    console.log("Google AI Studio loaded successfully.");
    console.log("Script execution finished. Keeping browser open for manual inspection.");

    // Do NOT close the browser automatically at the end of the script so the user can inspect the state.
    // The browser will remain open until closed manually or the Node.js process is stopped.
    
    return { success: true, message: "Browser launched and navigated to AI Studio successfully." };

  } catch (error) {
    console.error("An error occurred during browser automation:", error);

    const isLaunchFailure =
      error.message.includes("Failed to launch") ||
      error.message.includes("EBUSY") ||
      error.message.includes("lock") ||
      error.message.includes("Timeout") ||
      error.name === "TimeoutError";

    if (isLaunchFailure) {
      const warningMessage = "\n[TROUBLESHOOTING TIP] This error happens because Google Chrome is already running and locking your user profile directory.\n" +
        "When Chrome is already running under that profile, it delegates the window launch to the existing process and exits immediately. " +
        "As a result, Puppeteer cannot attach a debugging session, causing it to fail or time out.\n\n" +
        "To resolve this, please either:\n" +
        "1. Close all active Google Chrome windows completely before running: npm start\n" +
        "2. OR, change the userDataDir in index.js to a separate folder (e.g., 'C:\\Users\\Sam\\AppData\\Local\\Google\\Chrome\\User Data Automation') to run concurrently without interference.";
      console.warn(warningMessage);
      throw new Error("Chrome profile locked or launch timeout. See server logs for details.");
    }
    
    throw error;
  }
}
