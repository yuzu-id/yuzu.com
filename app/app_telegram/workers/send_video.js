module.exports = (chatId, videoData, bot) => {
  // Fungsi ini bisa digunakan untuk membalas user dengan video tertentu
  // Misalnya admin minta kirim video ke user
  bot.sendVideo(chatId, videoData.file_id, { caption: '🎬 Video dari sistem.' });
  
  console.log(`🎬 Video dikirim ke ${chatId}`);
};