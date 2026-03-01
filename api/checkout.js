const https = require('https');
const fs = require('fs');

module.exports = async (req, res)=>{
  if (req.method !== 'POST') return;
  const {id} = JSON.parse(req.body);

  const db = JSON.parse(fs.readFileSync('./db.json','utf-8'));
  const item = db[id];

  const postData = JSON.stringify({
    transaction_amount: 5.0,
    description:`APK ${item.nome}`,
    payment_method_id:'pix',
    payer:{email:'nao@precisa.com'},
    external_reference: id,
    notification_url: `https://${req.headers.host}/api/webhook`
  });

  const options = {
    hostname:'api.mercadopago.com',
    path:'/v1/payments',
    method:'POST',
    headers:{
      'Authorization':`Bearer ${process.env.MP_TOKEN}`,
      'Content-Type':'application/json'
    }
  };

  const hreq = https.request(options, (hres)=>{
    let body='';
    hres.on('data',d=>body+=d);
    hres.on('end',()=>{
      const p = JSON.parse(body);
      // salva ids
      db[id].mpOrderId = p.id;
      db[id].qr = p.point_of_interaction.transaction_data.qr_code_base64;
      db[id].copy = p.point_of_interaction.transaction_data.qr_code;
      fs.writeFileSync('./db.json', JSON.stringify(db));
      res.status(200).json({
        id,
        qr: db[id].qr,
        copy: db[id].copy
      });
    });
  });
  hreq.on('error',e=>res.status(500).send('erro'));
  hreq.write(postData);
  hreq.end();
};
