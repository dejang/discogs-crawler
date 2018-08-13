import { Release } from '../crawlers/Base';
import db from './index';


export async function setup() {
    await createReleaseTable();
    await createTracksTable();
    await createViewedTable();
}

async function createReleaseTable() {
    return new Promise((resolve, reject) => {
        db.run(`
        CREATE TABLE release (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            album TEXT,
            catno TEXT,
            thumb TEXT,
            discogsUrl TEXT            
        )
    `, [], function (err) {
                if (err) { reject(err); return; }
                resolve(this.lastID);
            });
    });
}

async function createTracksTable() {
    return new Promise((resolve, reject) => {
        db.run(`
        CREATE TABLE tracks (
            release_id TEXT NOT NULL,
            title TEXT NOT NULL,
            youtube TEXT,
            decks TEXT,
            deejay TEXT,
            beatport TEXT,          
            juno TEXT,            
            mp3free TEXT           
        )
    `, [], function (err) {
                if (err) { reject(err); return; }                
                resolve(this.lastID);
            });
    });
}

async function createViewedTable() {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE viewed (
                user_id TEXT NOT NULL,
                release_id TEXT NOT NULL,
                last_view_date TEXT
            )
        `, [], function (err) {
                if (err) { reject(err); return; }               
                resolve(this.lastID);
            })
    })
}