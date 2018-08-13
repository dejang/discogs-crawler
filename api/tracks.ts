
import express from 'express';
import { crawler, QItem, QTYPES } from '../crawlers/Base';

const router = express.Router();

router.post('/crawl', async function (req: any, res: any) {
    const qItem = new QItem();
    qItem.artist = req.body.artist
    qItem.crawler = QTYPES.YOUTUBE
    qItem.catno = req.body.catno
    qItem.releaseId = req.body.releaseId
    qItem.trackTitle = req.body.title
    crawler.emit('add', qItem);
    res.json({});
});


export default router;