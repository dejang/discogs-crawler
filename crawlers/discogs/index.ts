import { ExploreCriteria, Release, crawler, QItem, QTYPES } from '../Base';
import config from '../../config';
import { getRelease, addRelease } from '../../db/release';
import { Track, getTracks, addTrack } from '../../db/tracks';
import { EventEmitter } from 'events';
const DiscogsClient: any = require('disconnect').Client;
var dis = new DiscogsClient({ userToken: 'mgELFZaMrUNKeCNUUQLQPvwnypfcjLlpTRDPpbOc' });

const queue: Array<any> = [];

export class Discogs extends EventEmitter {
    async run() {
        if (queue.length === 0) {
            return;
        }

        const item = queue.shift();
        try {
            const tracks = await this.processItem(item);
            crawler.emit('discogs', { tracks, size: queue.length });
        } catch (e) {
            console.log(e.message);
            if (item.try) {
                return;
            }
            item.try = 1;
            setTimeout(() => queue.push(item), 120000);
        }
        this.run();
    }

    async search(exploreCriteria: ExploreCriteria): Promise<Array<Release>> {
        let releases = [];
        releases = await dis.database().search(exploreCriteria);

        const out: any = [];
        for (let i = 0; i < releases.results.length; i++) {
            const r = releases.results[i];

            if (!r.catno) continue

            const release: any = await getRelease(r.catno);
            if (release) {
                out.push(release);
                continue;
            }

            const obj = new Release()
            obj.id = r.catno
            obj.title = r.title
            obj.thumb = r.thumb
            obj.discogsUrl = r.uri

            const qItem = new QItem()
            qItem.releaseId = r.id;
            qItem.crawler = QTYPES.DISCOGS;
            qItem.catno = r.catno
            queue.push(qItem);
            out.push(obj);
        }
        crawler.emit('discogs', { size: queue.length })
        return out;
    }

    async processItem(q: QItem) {
        let release = await getRelease(q.catno);
        if (release) {
            const tracks: any = await getTracks(q.catno)
            if (tracks.length) {
                return tracks;
            }
        }

        const rObj = await dis.database().getRelease(q.releaseId);
        release = new Release();
        const artist = rObj.artists.map((a: any) => a.name).join(' ')

        release.artist = artist
        release.id = q.catno
        release.title = rObj.title
        release.catno = q.catno
        release.thumb = rObj.thumb
        release.discogsUrl = rObj.uri

        try {
            await addRelease(release)
        } catch (e) {
            console.log(`DUP: ${release.catno}`)
            return getTracks(release.id)
        }

        const tracks: any = [];
        for (let i = 0; i < rObj.tracklist.length; i++) {
            const r = rObj.tracklist[i]
            const video = rObj.videos ? rObj.videos.find((v: any) => {
                return v.description.indexOf(r.title) !== -1
            }) : null
            const track: Track = new Track();
            track.title = r.title
            track.release_id = q.catno
            track.youtube = video ? video.uri : ''

            await addTrack(track)
            const qItem = Object.assign({}, q, {
                trackTitle: track.title,
                artist: artist,
                releaseId: q.catno
            })
            if (!track.youtube) crawler.emit('add', Object.assign({}, qItem, { crawler: QTYPES.YOUTUBE }))
            crawler.emit('add', Object.assign({}, qItem, { crawler: QTYPES.BEATPORT }))
            crawler.emit('add', Object.assign({}, qItem, { crawler: QTYPES.DEEJAY }))
            tracks.push(track);
        }
        return tracks;
    }

    async send() {
        return Promise.resolve([]);
    }
}

const dcg = new Discogs();

setInterval(() => {
    dcg.run()
}, 10000);

export default new Discogs();