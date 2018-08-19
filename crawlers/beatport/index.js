class Beatport {
    async get(item) {
        const track = {};
        track.title = item.trackTitle;
        track.release_id = item.releaseId
        track.beatport = `https://www.beatport.com/search?q=${item.artist} ${track.title}`

        return [track];
    }
}

setTimeout(async() => {
    const queue = [];
    const shouldClose = false;
    const crawler = new Beatport();
    process.on('message', async(msg) => {
        queue.push(msg);
    });

    async function run() {
        const entry = queue.shift();
        if (!entry) {
            console.log('Beatport idle');
            setTimeout(run, 30000);
            return;
        }
        const returned = await crawler.get(entry);
        process.send({ tracks: returned, size: queue.length });
        setTimeout(run, 300);
    }

    await run();
}, 1)