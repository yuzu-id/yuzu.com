module.exports = (chatId, videoData, bot) => {
  const fileId = videoData.file_id;
  
  // Balas ke user
  bot.sendMessage(chatId, '🎬 Video diterima! Sedang diproses.');
  
  // Catat ke database
  console.log(`🎬 Video dari ${chatId}, file_id: ${fileId}`);
  
  // Template Firebase:
  // const db = require('firebase-admin').database();
  // db.ref(`uploads/${chatId}`).push({
  //   type: 'video',
  //   fileId: fileId,
  //   duration: videoData.duration || 0,
  //   timestamp: new Date().toISOString(),
  //   status: 'received'
  // });
};