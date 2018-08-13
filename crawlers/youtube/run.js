const fork = require('child_process').fork;

const testRelease = {
    releaseId: 'TRAUM V08',
    artist: 'Andreas Fragel',
    catno: 'TRAUM V08',
    trackTitle: 'Hotpoint',
    crawler: 'YOUTUBE'
};

(async() => {
    const child = fork(`${__dirname}/index.js`);
    child.on('message', (msg) => {
        console.log(msg);
    });

    setInterval(() => {
        child.send(testRelease);
        console.log('running');
    }, 5000);
})();