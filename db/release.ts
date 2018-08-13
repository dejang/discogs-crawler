import db from './index';
import { Release } from '../crawlers/Base';

export async function addRelease(release: Release) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO release VALUES(?, ?, ?, ?, ?, ?, ?)',
            [
                release.id,
                release.title,
                release.artist,
                release.album,
                release.catno,
                release.thumb,
                release.discogsUrl
            ], function (err) {
                if (err) {
                    reject(err);
                    return
                }
                resolve(this.lastID);
            })

    })
}

export async function getRelease(releaseId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(`
        SELECT * FROM release 
        LEFT JOIN (SELECT viewed.last_view_date FROM viewed WHERE viewed.release_id = ? AND user_id = ?) on 1= 1
        WHERE id = ?
    `, [releaseId, 1, releaseId], function (err, row) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
    })
}

export async function getAll(page: number, size: number = 100) {
    const offset = page > 1 ? page * size : 0;
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM release LIMIT ? OFFSET ?',
            [size, offset],
            function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            }
        )
    })
}