// webhook.js  –  salva como api/webhook.js

const mercadopago = require('mercadopago')
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id, status } = req.body?.data ?? {}          // notificação MP
  if (!id) return res.status(200).end()               // ping de segurança

  if (status === 'approved') {
    // ID do seu APK hospedado no Google Drive
    const fileId = process.env.DRIVE_FILE_ID || '1ABC123'
    const url = `https://drive.google.com/drive/folders/1Uu0mnJQkQ35vm74zeDdG9yhgL5yMbtUcexport=download&id=${fileId}`

    return res.json({ url })
  }

  res.status(200).end()
}
