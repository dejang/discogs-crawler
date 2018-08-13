function getEmbddedVideo(url = '') {
    if (!url) {
        return null;
    }
    const videoId = String.prototype.split.call(url, 'v=')[1];
    const iframe = document.createElement('iframe');
    iframe.width = '360';
    iframe.height = '150';
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = '0';
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    return iframe;
}

export function renderReleases(releases, container) {
    container.innerHTML = '';
    const tplRaw = document.querySelector('#release');
    releases.forEach(r => {
        const tpl = document.importNode(tplRaw.content, true);
        tpl.querySelector('img.release__thumb').src = r.thumb;
        tpl.querySelector('span.release__title').innerHTML = `${r.artist} - ${r.title}`;
        if (r.last_view_date) {
            tpl.querySelector('div.release').classList.add('viewed');
        }
        tpl.querySelector('div.release').addEventListener('click', (e) => {
            e.currentTarget.classList.add('viewed');
            renderRelease(r, e.currentTarget)
        });
        const el = container.appendChild(tpl);

    });
}

function renderLinks(release, tpl) {
    tpl.querySelector('#beatport').href = release.beatport;
    tpl.querySelector('#deejay').href = release.deejay;
}

export function renderRelease(release, el) {
    const cx = document.querySelector('#detail');
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'Close';
    closeBtn.classList.add('close');
    closeBtn.addEventListener('click', () => {
        cx.close()
        el.classList.add('blink');
        setTimeout(function() {
            el.classList.remove('blink');
        }, 1000)
    });
    cx.showModal();
    cx.innerHTML = '';
    cx.appendChild(closeBtn);
    fetch(`releases/release?id=${release.id}`)
        .then(resp => resp.json())
        .then((r) => {
            const tplRaw = document.querySelector('#release-detail');
            const tpl = document.importNode(tplRaw.content, true);
            tpl.querySelector('a.detail__title').innerHTML = `${release.artist} - ${release.title}`;
            tpl.querySelector('a.detail__title').href = `${release.discogsUrl}`;

            const tracksEl = tpl.querySelector('div.tracks');

            r.tracklist.forEach(t => {
                var trackTplRaw = document.querySelector('#track');
                const trackTpl = document.importNode(trackTplRaw.content, true);
                const title = trackTpl.querySelector('h4.track__title')
                title.innerHTML = t.title;
                if (t.youtube) {
                    const frame = getEmbddedVideo(t.youtube);
                    title.parentNode.insertBefore(document.adoptNode(frame), title.nextSibling);
                }
                renderLinks(t, trackTpl);
                tracksEl.appendChild(trackTpl);
            })

            cx.appendChild(tpl);
        })
    closeBtn.addEventListener('click', () => cx.close());
}