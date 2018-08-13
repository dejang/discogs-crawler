import ws from './socket';
import './search';
import { renderReleases } from "./releases";

const detailDialog = document.querySelector('#detail');

const videos = [];

detailDialog.addEventListener('dragend', (ev) => {
    const bound = ev.target.getBoundingClientRect();
    detailDialog.style.top = `${ev.clientX}px`;
    detailDialog.style.left = `${ev.clientY}px`;

});

document.body.addEventListener('keyup', (ev) => {
    if (ev.keyCode == 27) {
        document.querySelector('#detail').close();
    }
})

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