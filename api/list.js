const fs = require('fs');
module.exports = (req, res)=>{
  const db = JSON.parse(fs.readFileSync('./db.json','utf-8'));
  const arr = Object.values(db).filter(i=> i.pago);
  res.json(arr);
};
