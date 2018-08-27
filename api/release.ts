
import { getAll, getRelease } from '../db/release';
import express from 'express';
import dClient from '../crawlers/discogs';
import { ExploreCriteria } from '../crawlers/Base';
import { getTracks } from '../db/tracks';
import { addView, getView } from '../db/viewed';

const router = express.Router();

router.get('/', async function (req: any, res: any) {
    const page = req.params.page || 1;
    const releases = await getAll(page);
    res.json(releases);
});

router.get('/release', async function (req: any, res: any) {
    const id = req.query.id;
    await addView(req.query.token, id);
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
        page: req.query.page,
        q: req.query.searchString,
    }
    try {
        const releases: any = await dClient.search(params);
        for (let i = 0; i < releases.results.length; i++) {
            const viewed = await getView(req.query.token, releases.results[i].catno);
            releases.results[i].viewed = !!viewed;
        }
        res.json(releases);
    } catch (e) {
        res.status(500)
        res.render(e.message);
    }
})

export default router;