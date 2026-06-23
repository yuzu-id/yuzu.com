const TelegramBot = require('node-telegram-bot-api');
const config = require('../config.json');

// Inisialisasi bot
const token = config.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Import workers
const authUser = require('../workers/auth_user');
const sendPhoto = require('../workers/send_photo');
const sendVideo = require('../workers/send_video');
const receiveVideo = require('../workers/receive_video');

console.log('🤖 Bot yuzu.com sedang berjalan...');

// Perintah /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userData = msg.from;
  
  // Autentikasi / catat user
  authUser(chatId, userData);
  
  bot.sendMessage(chatId, `Halo ${userData.first_name || 'User'}! 👋\nKirimkan file (foto/video/dokumen) ke bot ini.`);
});

// Menangani foto
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const photoArray = msg.photo;
  sendPhoto(chatId, photoArray, bot);
});

// Menangani video
bot.on('video', (msg) => {
  const chatId = msg.chat.id;
  const videoData = msg.video;
  receiveVideo(chatId, videoData, bot);
});

// Menangani dokumen (opsional, untuk file PDF dll)
bot.on('document', (msg) => {
  const chatId = msg.chat.id;
  const doc = msg.document;
  // Untuk sementara kita kirim balasan, nanti bisa diarahkan ke worker terpisah
  bot.sendMessage(chatId, `📄 Dokumen "${doc.file_name}" diterima.`);
  
  // Catat ke Firebase (nanti)
  const db = require('firebase-admin').database();
  db.ref(`uploads/${chatId}`).push({
    type: 'document',
    filename: doc.file_name,
    fileId: doc.file_id,
    timestamp: new Date().toISOString(),
    status: 'received'
  });
});

// Error handling polling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});