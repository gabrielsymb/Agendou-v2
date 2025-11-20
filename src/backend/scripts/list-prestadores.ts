import { getDbInstance } from '../database';
import fs from 'fs';
import path from 'path';

// show DB path (same logic as database/index.ts uses process.env.DB_PATH or /data/agenda.sqlite)
const DB_PATH = process.env.DB_PATH || '/data/agenda.sqlite';
const dbPathAbsolute = path.resolve(DB_PATH);
console.log('DB_PATH (env or default)=', DB_PATH);
console.log('Resolved DB path =', dbPathAbsolute);

const db = getDbInstance();
try{
  const rows = db.prepare('SELECT id, nome, email FROM prestadores').all();
  console.log('Prestadores found:', rows.length);
  console.table(rows);
}catch(err){
  console.error('Erro ao listar prestadores:', err && (err.stack || err.message || err));
}
