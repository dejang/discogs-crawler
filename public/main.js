'use strict';

const ws = new WebSocket('ws://localhost:3000/echo');

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

function renderReleases(releases, container) {
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
            renderRelease(r, e.currentTarget);
        });
        const el = container.appendChild(tpl);

    });
}

function renderLinks(release, tpl) {
    tpl.querySelector('#beatport').href = release.beatport;
    tpl.querySelector('#deejay').href = release.deejay;
}

function renderRelease(release, el) {
    const cx = document.querySelector('#detail');
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'Close';
    closeBtn.classList.add('close');
    closeBtn.addEventListener('click', () => {
        cx.close();
        el.classList.add('blink');
        setTimeout(function() {
            el.classList.remove('blink');
        }, 1000);
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
                const title = trackTpl.querySelector('h4.track__title');
                title.innerHTML = t.title;
                if (t.youtube) {
                    const frame = getEmbddedVideo(t.youtube);
                    title.parentNode.insertBefore(document.adoptNode(frame), title.nextSibling);
                }
                renderLinks(t, trackTpl);
                tracksEl.appendChild(trackTpl);
            });

            cx.appendChild(tpl);
        });
    closeBtn.addEventListener('click', () => cx.close());
}

const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010];

const tpl = document.querySelector('#form-year-decade');
const searchCx = document.querySelector('#search');
const submit = document.querySelector('#submit');
const currentPage = document.querySelector('#currentPage');
const prev = document.querySelector("#previous");
const next = document.querySelector('#next');
const styleEl = document.querySelector('#style-input');

const formValues = {
    genre: 'Electronic',
    decade: 2010,
    year: 2010,
    style: 'Minimal',
    format: 'Vinyl',
    page: 1,
};

Object.defineProperty(formValues, 'toString', {
    enumerable: false,
    value() {
        const propNames = Object.getOwnPropertyNames(this);
        const params = [];
        propNames.forEach((p) => {
            const self = this;
            if (p === 'toString') return
            if (self[p] !== null || self[p] !== undefined) {
                params.push(`${p}=${self[p]}`);
            } else {
                params.push(`${p}=`);
            }
        });
        return params.join('&');
    }
});

const decadeInput = tpl.querySelector('#decade-input');
decadeInput.addEventListener('change', onChangeDecade);

const yearEl = searchCx.querySelector('#year-input');
yearEl.addEventListener('change', onChangeYear);

styleEl.addEventListener('change', (ev) => {
    formValues.style = ev.target.value;
});

prev.addEventListener('click', () => {
    if (formValues.page == 1) {
        return;
    }

    formValues.page--;
    currentPage.innerHTML = `Page: ${formValues.page}`;
    submit.click();
});

next.addEventListener('click', () => {
    formValues.page++;
    currentPage.innerHTML = `Page: ${formValues.page}`;
    submit.click();
});


function renderDecade() {
    decadeInput.innerHTML = '';
    decades.forEach(decade => {
        const opt = document.createElement('option');
        opt.innerHTML = `${decade}`;
        opt.value = `${decade}`;
        decadeInput.appendChild(opt);
    });
}

function onChangeYear(ev) {
    formValues.year = Number(ev.target.value);
}

function onChangeDecade(ev) {
    formValues.decade = Number(ev.target.value);
    yearEl.innerHTML = '';
    const start = decades[decades.indexOf(formValues.decade)];

    for (let i = start; i <= start + 9; i++) {
        const opt = document.createElement('option');
        opt.innerHTML = String(i);
        opt.value = String(i);
        opt.addEventListener('change', onChangeYear);
        yearEl.appendChild(opt);
    }
}

submit.addEventListener('click', () => {
    const params = formValues.toString();
    fetch(`releases/search?${params}`).then((res) => res.json()).then((releases) => {
        renderReleases(releases, document.querySelector('#content'));
    });
});

renderDecade();
decadeInput.value = formValues.decade;
onChangeDecade({ target: { value: formValues.decade } });
yearEl.value = formValues.year;
styleEl.value = formValues.style;
submit.click();

const detailDialog = document.querySelector('#detail');

detailDialog.addEventListener('dragend', (ev) => {
    const bound = ev.target.getBoundingClientRect();
    detailDialog.style.top = `${ev.clientX}px`;
    detailDialog.style.left = `${ev.clientY}px`;

});

document.body.addEventListener('keyup', (ev) => {
    if (ev.keyCode == 27) {
        document.querySelector('#detail').close();
    }
});

ws.addEventListener('open', (ev) => {
    ws.send(JSON.stringify({ type: 'ECHO', data: 'asd' }));
});

ws.onmessage = (ev) => {
    const { type, data } = JSON.parse(ev.data);
    if (type === 'CRAWLER_ADD') {
        document.querySelector('#ytb').innerHTML = `Youtube: ${data.youtube}`;
        document.querySelector('#dcg').innerHTML = `Discogs: ${data.discogs}`;
        document.querySelector('#btp').innerHTML = `Beatport: ${data.beatport}`;
        document.querySelector('#djy').innerHTML = `Deejay: ${data.deejay}`;
    }
};
