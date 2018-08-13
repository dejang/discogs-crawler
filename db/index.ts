import { setup } from './install';
import sqlite3, { verbose } from 'sqlite3';
sqlite3.verbose();
const db = new sqlite3.Database(`${__dirname}/discogs.db`);

db.run('SELECT * FROM release LIMIT 1', [], (err) => {
    if (err) {
        (async () => {
            await setup();
        })()
    }
})

export default db;