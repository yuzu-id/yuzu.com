const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Mengaktifkan CORS (Cross-Origin Resource Sharing)
// Ini wajib agar frontend GitHub Pages Anda diizinkan mengirim file ke server backend Node.js ini
app.use(cors());

// 2. Membaca Token dan Channel ID dari file config.json secara otomatis
const configPath = path.join(__dirname, 'config.json');
let config;
try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (err) {
    console.error("Gagal membaca file bot/config.json. Pastikan file tersebut sudah dibuat.");
    process.exit(1);
}

// 3. Konfigurasi Penyimpanan Sementara (Multer)
// File akan disimpan sementara di dalam folder 'uploads/' di server sebelum diteruskan ke Telegram
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 1024 * 1024 * 1024 } // Batasan ukuran file maksimal 1 GB
});

// Pastikan folder 'uploads/' otomatis terbuat jika belum ada
if (!fs.existsSync('uploads/')){
    fs.mkdirSync('uploads/');
}

// 4. Endpoint Utama untuk Menerima Berkas dari Mini App
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    
    // Validasi apakah ada file yang dikirim
    if (!file) {
        return res.status(400).json({ success: false, error: 'Tidak ada berkas yang dipilih.' });
    }

    try {
        // Alamat Telegram Bot API resmi untuk mengirim dokumen/video
        const telegramUrl = `https://api.telegram.org/bot${config.BOT_TOKEN}/sendDocument`;
        
        // Membuat struktur FormData baru untuk dikirim ke Telegram
        const formData = new FormData();
        formData.append('chat_id', config.CHANNEL_ID);
        
        // Menggunakan fs.createReadStream agar file besar dialirkan sedikit demi sedikit (Hemat RAM Server)
        formData.append('document', fs.createReadStream(file.path), {
            filename: file.originalname // Mempertahankan nama asli file saat tiba di Channel Telegram
        });

        console.log(`Sedang meneruskan file "${file.originalname}" ke Channel ${config.CHANNEL_ID}...`);

        // Mengirimkan data ke Telegram menggunakan Axios
        const response = await axios.post(telegramUrl, formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,  // Menghapus batasan ukuran response Axios
            maxBodyLength: Infinity      // Menghapus batasan ukuran request Axios (Penting untuk file 1GB)
        });

        // Hapus file sampah sementara di dalam folder 'uploads/' agar memori server tidak penuh
        fs.unlinkSync(file.path);

        // Jika Telegram sukses menerima file
        if (response.data.ok) {
            console.log(`File "${file.originalname}" sukses terposting ke Channel V!`);
            return res.json({ success: true, message: 'Berhasil dikirim ke Channel V.' });
        } else {
            return res.status(500).json({ success: false, error: 'Telegram menolak berkas tersebut.' });
        }

    } catch (error) {
        // Jika terjadi error, hapus file sementara yang gagal agar tidak menumpuk
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        
        console.error("Terjadi kesalahan pada server Node.js:", error.message);
        return res.status(500).json({ 
            success: false, 
            error: 'Terjadi masalah pada internal server backend Node.js.' 
        });
    }
});

// 5. Menjalankan Server Node.js
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Server Backend Node.js Bot Yuzu Berhasil Aktif!`);
    console.log(`📡 Berjalan di port: ${PORT}`);
    console.log(`==================================================`);
});
