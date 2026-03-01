const fs = require('fs');
module.exports = (req, res)=>{
  const db = JSON.parse(fs.readFileSync('./db.json','utf-8'));
  const id = req.query.id;
  if (db[id] && db[id].pago) {
    return res.json({ pago:true, nome:db[id].nome, url:`/${id}.apk` });
  }
  res.json({ pago:false });
};
