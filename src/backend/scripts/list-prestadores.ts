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
}catch(err: any){
  try{
    if (err && typeof err === 'object' && ('stack' in err || 'message' in err)){
      console.error('Erro ao listar prestadores:', (err.stack as any) || (err.message as any) || err);
    } else {
      console.error('Erro ao listar prestadores:', err);
    }
  }catch(logErr){
    console.error('Erro ao logar erro em list-prestadores:', logErr);
  }
}
