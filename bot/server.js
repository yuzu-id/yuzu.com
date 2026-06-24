const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const BOT_TOKEN = config.botToken;
const CHANNEL_ID = config.channelId;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

app.post('/send-video', async (req, res) => {
  const { videoUrl, caption } = req.body;
  if (!videoUrl) return res.status(400).json({ error: 'videoUrl wajib diisi' });

  try {
    const response = await axios.post(`${TELEGRAM_API}/sendVideo`, {
      chat_id: CHANNEL_ID,
      video: videoUrl,
      caption: caption || '',
      supports_streaming: true
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Gagal mengirim video' });
  }
});

app.post('/send-photo', async (req, res) => {
  const { photoUrl, caption } = req.body;
  if (!photoUrl) return res.status(400).json({ error: 'photoUrl wajib diisi' });

  try {
    const response = await axios.post(`${TELEGRAM_API}/sendPhoto`, {
      chat_id: CHANNEL_ID,
      photo: photoUrl,
      caption: caption || ''
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Gagal mengirim foto' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bot server berjalan di port ${PORT}`);
  console.log(`📤 Channel tujuan: ${CHANNEL_ID}`);
});