const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Mengaktifkan CORS agar GitHub Pages diizinkan mengirim file ke backend ini
app.use(cors());

// Membaca file config.json untuk mengambil token keamanan
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Konfigurasi Multer untuk menampung sementara file 1 GB dalam kepingan memori disk
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 1024 * 1024 * 1024 } // Batas keras 1 GB
});

// Endpoint pemroses pengiriman ke Telegram
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Tidak ada berkas yang masuk.' });
        }

        const telegramUrl = `https://api.telegram.org/bot${config.BOT_TOKEN}/sendDocument`;
        const formData = new FormData();
        formData.append('chat_id', config.CHANNEL_ID);
        
        // Membuka aliran data (Stream) agar server hemat RAM saat memproses file 1 GB
        formData.append('document', fs.createReadStream(file.path), {
            filename: file.originalname
        });

        // Mengirimkan data stream langsung ke Telegram API server
        const response = await axios.post(telegramUrl, formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // Menghapus berkas sementara dari server agar penyimpanan tidak penuh
        fs.unlinkSync(file.path);

        if (response.data.ok) {
            return res.json({ success: true, message: 'Berhasil dikirim ke Channel V.' });
        } else {
            return res.status(500).json({ error: 'Telegram menolak berkas.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Masalah pada internal server backend.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server Backend Bot Yuzu berjalan di port ${PORT}`);
});
