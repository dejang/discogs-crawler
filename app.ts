import express from 'express';
import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import { crawler, QItem } from './crawlers/Base';
import { encodeMessage, TYPE, parseMsg } from './ws';

const instance = expressWs(express());
const app = instance.app;
app.use(express.static('public'));
app.use(bodyParser.json());

app.ws('/echo', function (ws, req) {
    const messagegeHandler = (data: any) => {
        if (ws.readyState === 1) ws.send(data)
    }
    crawler.on('message', messagegeHandler)

    ws.on('message', async (msg: any) => {
        const { type, data } = parseMsg(msg)
        switch (type) {
            case TYPE.CRAWLER_ADD: {
                crawler.emit('add', data);
                break;
            }
            case TYPE.ECHO: {
                ws.send(encodeMessage(msg, TYPE.ECHO));
            }
        }
    });

    ws.on('close', () => {
        crawler.removeListener('message', messagegeHandler);
    })
})

export default app;
export const ws = instance;