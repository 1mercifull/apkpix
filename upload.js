const fs = require('fs');
const path = require('path');
const { v4:uuid } = require('uuid');
const formidable = require('formidable');

module.exports = (req, res)=>{
  if (req.method !== 'POST') return res.status(404).end();
  const form = formidable({uploadDir:'/tmp', keepExtensions:true, maxFileSize:150*1024*1024});
  form.parse(req, (err, fields, files)=>{
    if (err) return res.status(413).json({ok:0});
    const file = files.apk;
    const id = uuid();
    const nomeFinal = id+'.apk';
    const dest = path.join(__dirname,'../../public',nomeFinal);
    fs.copyFileSync(file.filepath, dest);

    // banco simples
    const db = JSON.parse(fs.readFileSync('./db.json','utf-8') || '{}');
    db[id] = {
      id,
      nome: file.originalFilename,
      tamanho: file.size,
      pago:false,
      valor:'5.00',
      mpOrderId:null,
      qr:null,
      copy:null
    };
    fs.writeFileSync('./db.json', JSON.stringify(db));
    res.json({ok:1, id});
  });
};
