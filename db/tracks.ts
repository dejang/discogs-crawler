import db from './index';

export class Track {
    public release_id: string = ''
    public title: string = ''
    public youtube: string = ''
    public decks: string = ''
    public deejay: string = ''
    public beatport: string = ''
    public juno: string = ''
    public mp3free: string = ''
}

function add(t: Track) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO tracks VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                t.release_id,
                t.title,
                t.youtube,
                t.decks,
                t.deejay,
                t.beatport,
                t.juno,
                t.mp3free
            ], function (err) {
                if (err) {
                    reject(err);
                    return
                }
                resolve(this.lastID);
            })
    });
}

function update(t: Track) {
    return new Promise((resolve, reject) => {
        let value, field
        if (t.beatport) {
            field = 'beatport'
            value = t.beatport
        } else if (t.youtube) {
            field = 'youtube'
            value = t.youtube
        } else if (t.deejay) {
            field = 'deejay'
            value = t.deejay            
        } else {
            return resolve()
        }

        db.run(`UPDATE tracks SET ${field} = ? WHERE release_id = ? AND title = ?`,
            [
                value,
                t.release_id,
                t.title
            ], function (err) {
                if (err) {
                    reject(err);
                    return
                }
                resolve(this.lastID);
            })
    })
}

export async function addTrack(t: Track) {
    const track: any = await getTrack(t.release_id, t.title)
    if (track[0]) {
        return update(t)
    }

    return add(t)


}

export async function getTracks(releaseId: string) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM tracks WHERE release_id = ?',
            [releaseId],
            function (err, rows) {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows);
            })
    });
}

export async function getTrack(releaseId: string, title: string) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM tracks WHERE release_id = ? AND title = ?',
            [releaseId, title],
            function (err, rows) {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows);
            })
    });
}
