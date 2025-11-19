const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '..', '..', '..', 'data', 'agenda.sqlite'); // C:\Agendou\data\agenda.sqlite
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) return console.error('Erro abrindo DB:', err.message);
});

function query(sql) {
  return new Promise((resolve, reject) =>
    db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)))
  );
}

(async () => {
  try {
    console.log('DB:', dbPath);
    console.log('\nÚltimos prestadores:');
    const prest = await query(`SELECT id, nome, email, substr(senhaHash,1,16) AS hash_sample, rowid 
                               FROM prestadores ORDER BY rowid DESC LIMIT 10;`);
    console.table(prest);

    console.log('\nLicenças (últimas 10):');
    const lic = await query(`SELECT id, prestadorId, tipoLicenca, dataInicio, dataFim, ativa FROM licenca ORDER BY dataInicio DESC LIMIT 10;`);
    console.table(lic);
  } catch (err) {
    console.error('Erro na query:', err);
  } finally {
    db.close();
  }
})();