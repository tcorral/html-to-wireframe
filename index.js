const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const viewports = require('./lib/viewports/index');

// Configuration des arguments (ex: npm start -- --urls="http://google.com")
const argv = yargs(hideBin(process.argv))
    .option('urls', {
        alias: 'u',
        type: 'string',
        description: 'Liste des URLs séparées par des virgules',
        demandOption: true
    })
    .parse();

const urls = argv.urls.split(',').map(u => u.trim());

// Chemin vers le script Wirify existant
const WIRIFY_SCRIPT_PATH = path.join(__dirname, 'lib/wirify/index.js');

(async () => {
    // Lancement du navigateur
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        for (const url of urls) {
            console.log(`\n🚀 Traitement de l'URL : ${url}`);
            
            // Création d'un dossier pour l'URL
            const urlFolder = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const savePath = path.join(__dirname, 'screenshots', urlFolder);
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath, { recursive: true });
            }

            const page = await browser.newPage();

            // On va sur la page
            try {
                await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
            } catch (e) {
                console.error(`❌ Erreur lors du chargement de ${url}:`, e.message);
                await page.close();
                continue;
            }

            // Injection de jQuery
            await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.6.0.min.js' });
            
            // Injection du script Wirify local
            await page.addScriptTag({ path: WIRIFY_SCRIPT_PATH });

            // On déclenche Wirify
            await page.evaluate(() => {
                if (typeof wf_wirify !== 'undefined') {
                    wf_wirify();
                }
            });

            // Attendre que l'overlay apparaisse
            try {
                await page.waitForSelector('#wirify', { timeout: 10000 });
            } catch (e) {
                console.warn("⚠️ Wirify semble avoir pris du temps ou échoué, on continue...");
            }

            // Nettoyage de l'interface avant capture
            await page.evaluate(() => {
                const info = document.getElementById('wf-info');
                const watermark = document.getElementById('wf-watermark');
                if (info) info.style.display = 'none';
                if (watermark) watermark.style.display = 'none';
            });

            // Boucle sur les viewports
            for (const vp of viewports) {
                const pWidth = parseInt(vp["Portrait Width"], 10);
                const lWidth = parseInt(vp["Landscape Width"], 10);

                if (isNaN(pWidth) || isNaN(lWidth)) continue;

                // --- Capture PORTRAIT ---
                await page.setViewport({ width: pWidth, height: lWidth });
                await new Promise(r => setTimeout(r, 500));
                
                let filename = `${vp["Device Name"]}-Portrait-${pWidth}x${lWidth}.png`.replace(/[^a-z0-9\-\.]/gi, '_');
                await page.screenshot({ path: path.join(savePath, filename), fullPage: true });
                console.log(`📸 Capture : ${filename}`);

                // --- Capture PAYSAGE ---
                await page.setViewport({ width: lWidth, height: pWidth });
                await new Promise(r => setTimeout(r, 500));

                filename = `${vp["Device Name"]}-Landscape-${lWidth}x${pWidth}.png`.replace(/[^a-z0-9\-\.]/gi, '_');
                await page.screenshot({ path: path.join(savePath, filename), fullPage: true });
                console.log(`📸 Capture : ${filename}`);
            }

            await page.close();
        }
    } catch (error) {
        console.error("Erreur globale:", error);
    } finally {
        await browser.close();
        console.log('\n✅ Terminé.');
    }
})();
