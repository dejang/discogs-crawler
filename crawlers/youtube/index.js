const puppeteer = require('puppeteer');
const Browser = puppeteer.Browser;

let browser;


class Youtube {
    async get(item) {
        console.log('scrapping youtube')
        const page = await browser.newPage();
        const term = `${item.artist} ${item.trackTitle}`;

        await page.goto('http://www.youtube.com');
        await page.type('#search-form #search', term);
        const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.click('#search-icon-legacy');
        await navigationPromise;

        const href = await page.evaluate(() => {
            const el = document.querySelector('.ytd-video-renderer #thumbnail');
            return el ? el.href : '';
        });
        page.close();

        const track = {};
        track.title = item.trackTitle;
        track.release_id = item.releaseId
        track.youtube = href;

        return [track];
    }
}

setTimeout(async() => {
    browser = await puppeteer.launch();

    const queue = [];
    const shouldClose = false;
    const youtube = new Youtube();
    debugger;
    process.on('message', async(msg) => {
        queue.push(msg);
    });

    let counter = 0;

    async function run() {
        const entry = queue.shift();
        if (!entry) {
            setTimeout(run, 30000);
            return;
        }
        const returned = await youtube.get(entry);
        process.send({ tracks: returned, size: queue.length });
        setTimeout(run, 5000);
    }

    await run();
}, 1)