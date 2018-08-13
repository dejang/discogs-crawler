import db from './index';
export async function addView(userId: string, releaseId: string) {
    return new Promise((resolve, reject) => {
        db.run(`REPLACE INTO viewed(user_id, release_id, last_view_date) VALUES(?, ?, ?)`, [userId, releaseId, new Date().getTime()], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}