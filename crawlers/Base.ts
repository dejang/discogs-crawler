import { EventEmitter } from "events";
import Discogs from './discogs';
import { Track, addTrack } from "../db/tracks";
import { TYPE, encodeMessage } from "../ws";
import { fork, ChildProcess } from 'child_process';

export interface ExploreCriteria {
    decade?: number,
    year?: number,
    style?: string,
    format?: string,
    genre?: string,
    searchString?: string,
    page?: number,
}

export class Release {
    public artist = ''
    public album = ''
    public tracklist = []
    public id = ''
    public title = ''
    public catno = ''
    public thumb = ''
    public discogsUrl = ''
    public viewed = false
}

export interface IBase {
    search: Function,
    getRelease: Function
}

export const QTYPES = {
    YOUTUBE: 'YOUTUBE',
    DISCOGS: 'DISCOGS',
    BEATPORT: 'BEATPORT',
    DEEJAY: 'DEEJAY',
}

const children = {
    [QTYPES.YOUTUBE]: fork(`${__dirname}/youtube/index.js`),
    [QTYPES.BEATPORT]: fork(`${__dirname}/beatport/index.js`),
    [QTYPES.DEEJAY]: fork(`${__dirname}/deejay/index.js`),
    [QTYPES.DISCOGS]: Discogs
}

const stats: any = {
    deejay: -1,
    beatport: -1,
    youtube: -1,
    discogs: -1,
}

export class QItem {
    public releaseId = ''
    public crawler: any
    public artist = ''
    public catno = ''
    public trackTitle = ''
}

class Crawler extends EventEmitter {
    private started: boolean
    private busy: boolean
    private queue: Array<QItem>
    private ws: any

    constructor() {
        super();
        this.started = true;
        this.busy = false;
        this.queue = [];

        this.on('add', this.enqueue);
        this.run();
    }

    enqueue(item: QItem) {
        console.log(`Adding to ${item.crawler}: ${item.catno} - ${item.artist} - ${item.trackTitle}`)
        const child: any = children[item.crawler];
        child.send(item);
    }

    async run() {
        this.started = true;
        if (this.queue.length === 0) {
            setTimeout(() => {
                this.run()
            }, 10000)
            return
        }
        this.run()
    }

}

const crawler: any = new Crawler();

function createListener(type: any) {
    return async function listener(message: any) {
        const { tracks, size } = message;
        for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i];
            stats[type] = size;
            crawler.emit('message', encodeMessage(stats, TYPE.CRAWLER_ADD));
            await addTrack(t);
        }
    }
}

Object.keys(children).forEach((k) => {
    const child: any = children[k];
    child.on('message', createListener(k.toLocaleLowerCase()));
});

crawler.on('discogs', (ev: any) => {
    stats.discogs = ev.size;
    crawler.emit('message', encodeMessage(stats, TYPE.CRAWLER_ADD));
})

export { crawler };