const fs = require('fs');
module.exports = (req, res)=>{
  if (req.method !== 'POST') return;
  const { id } = req.body.data || {};
  const dbRaw = fs.readFileSync('./db.json','utf-8');
  let db = JSON.parse(dbRaw);
  const idx = Object.keys(db).find(k=> db[k].mpOrderId == id);
  if (idx && !db[idx].pago) {
    db[idx].pago = true;
    db[idx].dataPgto = new Date().toISOString();
    fs.writeFileSync('./db.json', JSON.stringify(db));
  }
  res.status(200).send('ok');
};
