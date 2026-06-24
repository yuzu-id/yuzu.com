const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors()); // Izinkan akses dari domain lain
app.use(express.json());

// Buat folder uploads jika belum ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi penyimpanan file upload
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Baca konfigurasi bot
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const BOT_TOKEN = config.botToken;
const CHANNEL_ID = config.channelId;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ENDPOINT UPLOAD FILE (untuk kirim file langsung dari aplikasi)
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const caption = req.body.caption || '';

  if (!file) {
    return res.status(400).json({ error: 'Tidak ada file yang diupload' });
  }

  try {
    // Deteksi tipe file
    const isVideo = file.mimetype.startsWith('video/');
    const method = isVideo ? 'sendVideo' : 'sendPhoto';
    
    // Siapkan FormData untuk Telegram
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('chat_id', CHANNEL_ID);
    formData.append('caption', caption);
    formData.append(isVideo ? 'video' : 'photo', fs.createReadStream(file.path));

    // Kirim ke Telegram
    const response = await axios.post(`${TELEGRAM_API}/${method}`, formData, {
      headers: { ...formData.getHeaders() }
    });

    // Hapus file sementara
    fs.unlinkSync(file.path);

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    // Hapus file jika gagal
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    res.status(500).json({ error: 'Gagal mengirim file ke Telegram' });
  }
});

// ENDPOINT KIRIM VIA URL (untuk Mini App tombol)
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

// JALANKAN SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bot server berjalan di port ${PORT}`);
  console.log(`📤 Channel tujuan: ${CHANNEL_ID}`);
});