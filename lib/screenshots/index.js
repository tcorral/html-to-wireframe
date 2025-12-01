const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const viewports = require('./../viewports/index');
const urls = require('./../urls/index');

async function takeScreenshots() {
  console.log('Starting screenshot generation with Playwright...');

  let browser;
  try {
    browser = await chromium.launch({
      headless: true
    });

    for (const url of urls) {
      console.log('Processing URL:', url);

      // Create directory for screenshots
      const urlDir = path.join('screenshots', url.replace(/https?:\/\//, '').replace(/\//g, '_'));
      if (!fs.existsSync(urlDir)) {
        fs.mkdirSync(urlDir, { recursive: true });
      }

      

      for (const viewport of viewports.slice(0, 3)) { // Limit to first 3 viewports for testing
        const context = await browser.newContext();
        const page = await context.newPage();
        console.log('Current location is ' + page.url());

        try {
          const portraitWidth = parseInt(viewport["Portrait Width"], 10);
          const portraitHeight = parseInt(viewport["Landscape Width"], 10);
          const landscapeWidth = parseInt(viewport["Landscape Width"], 10);
          const landscapeHeight = parseInt(viewport["Portrait Width"], 10);

          // Portrait screenshot
          await page.setViewportSize({ width: portraitWidth, height: portraitHeight });
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          

          // Inject wirify script
          const wirifyScript = fs.readFileSync('lib/wirify/index.js', 'utf8');
          await page.addScriptTag({ content: wirifyScript });

          // Wait for wireframe generation
          await page.waitForTimeout(5000);

          // Wait additional time for processing
          await page.waitForTimeout(3000);

          // Hide original page content and show only wireframe
          await page.evaluate(() => {
            // Hide all original content
            const allElements = document.querySelectorAll('body > *:not(#wirify)');
            allElements.forEach(el => {
              if (el.id !== 'wirify') {
                el.style.display = 'none';
              }
            });

            // Ensure wirify overlay is visible and covers everything
            const wirify = document.getElementById('wirify');
            if (wirify) {
              wirify.style.position = 'fixed';
              wirify.style.top = '0';
              wirify.style.left = '0';
              wirify.style.width = '100vw';
              wirify.style.height = '100vh';
              wirify.style.zIndex = '999999';
              wirify.style.background = 'white';
            }

            // Remove wireframe info elements if they exist
            const wfInfo = document.getElementById('wf-info');
            if (wfInfo && wfInfo.parentNode) wfInfo.parentNode.removeChild(wfInfo);
            const wfWatermark = document.getElementById('wf-watermark');
            if (wfWatermark && wfWatermark.parentNode) wfWatermark.parentNode.removeChild(wfWatermark);
          });

          const portraitFilename = path.join(urlDir, `${viewport["Device Name"]}-${portraitWidth}x${portraitHeight}.png`);
          await page.screenshot({
            path: portraitFilename,
            fullPage: true
          });
          console.log(`Screenshot for ${viewport["Device Name"]} (${portraitWidth}x${portraitHeight})`);

          await context.close();

          // Landscape screenshot - new context for each orientation
          const context2 = await browser.newContext();
          const page2 = await context2.newPage();

          await page2.setViewportSize({ width: landscapeWidth, height: landscapeHeight });
          await page2.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

          // Inject wirify script again
          await page2.addScriptTag({ content: wirifyScript });

          // Wait for wireframe generation
          await page2.waitForTimeout(5000);

          // Wait additional time for processing
          await page2.waitForTimeout(3000);

          // Hide original page content and show only wireframe
          await page2.evaluate(() => {
            // Hide all original content
            const allElements = document.querySelectorAll('body > *:not(#wirify)');
            allElements.forEach(el => {
              if (el.id !== 'wirify') {
                el.style.display = 'none';
              }
            });

            // Ensure wirify overlay is visible and covers everything
            const wirify = document.getElementById('wirify');
            if (wirify) {
              wirify.style.position = 'fixed';
              wirify.style.top = '0';
              wirify.style.left = '0';
              wirify.style.width = '100vw';
              wirify.style.height = '100vh';
              wirify.style.zIndex = '999999';
              wirify.style.background = 'white';
            }

            // Remove wireframe info elements if they exist
            const wfInfo = document.getElementById('wf-info');
            if (wfInfo && wfInfo.parentNode) wfInfo.parentNode.removeChild(wfInfo);
            const wfWatermark = document.getElementById('wf-watermark');
            if (wfWatermark && wfWatermark.parentNode) wfWatermark.parentNode.removeChild(wfWatermark);
          });

          const landscapeFilename = path.join(urlDir, `${viewport["Device Name"]}-${landscapeWidth}x${landscapeHeight}.png`);
          await page2.screenshot({
            path: landscapeFilename,
            fullPage: true
          });
          console.log(`Screenshot for ${viewport["Device Name"]} (${landscapeWidth}x${landscapeHeight})`);

          await context2.close();

        } catch (error) {
          console.error(`Error processing viewport ${viewport["Device Name"]} for URL ${url}:`, error.message);
          await context.close();
        }
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

takeScreenshots().catch(console.error);
