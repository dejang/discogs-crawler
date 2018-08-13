
import { getAll, getRelease } from '../db/release';
import express from 'express';
import dClient from '../crawlers/discogs';
import { ExploreCriteria } from '../crawlers/Base';
import { getTracks } from '../db/tracks';
import { addView } from '../db/viewed';

const router = express.Router();

router.get('/', async function (req: any, res: any) {
    const page = req.params.page || 1;
    const releases = await getAll(page);
    res.json(releases);
});

router.get('/release', async function (req: any, res: any) {
    const id = req.query.id;
    await addView('1', id);
    const release = await getRelease(id);
    release.tracklist = await getTracks(id);

    res.json(release);
});

router.get('/search', async function (req: any, res: any) {
    const params: ExploreCriteria = {
        decade: req.query.decade,
        year: req.query.year,
        style: req.query.style,
        format: req.query.format,
        genre: req.query.genre,
        page: req.query.page
    }

    const releases = await dClient.search(params);
    res.json(releases);    
})

export default router;