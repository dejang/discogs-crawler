class Deejay {
  async get (item) {
    const track = {};
    track.title = item.trackTitle;
    track.release_id = item.releaseId;
    const catno = item.catno.replace (/\s+/g, '');
    track.deejay = `https://www.deejay.de/${catno}`;

    return [track];
  }
}

setTimeout (async () => {
  const queue = [];
  const shouldClose = false;
  const crawler = new Deejay ();
  process.on ('message', async msg => {
    queue.push (msg);
  });

  async function run () {
    const entry = queue.shift ();
    if (!entry) {
      console.log ('Deejay idle');
      setTimeout (run, 30000);
      return;
    }
    const returned = await crawler.get (entry);
    process.send ({tracks: returned, size: queue.length});
    setTimeout (run, 300);
  }

  await run ();
}, 1);
