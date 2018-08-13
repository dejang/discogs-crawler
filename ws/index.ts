import app, { ws } from '../app';
import { crawler } from '../crawlers/Base';

export const TYPE = {
    CRAWLER_ADD: 'CRAWLER_ADD',
    ECHO: 'ECHO'
}

export interface WS_MESSAGE {
    type: string
    data: any
}

export function parseMsg(msg: string) {
    return JSON.parse(msg);
}

export function encodeMessage(data: any, type: string) {
    const msg = JSON.stringify({ type, data });
    return msg;
}
