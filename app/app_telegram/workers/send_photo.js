module.exports = (chatId, photoArray, bot) => {
  // Ambil file_id dari ukuran terbesar (paling akhir)
  const fileId = photoArray[photoArray.length - 1].file_id;
  
  // Balas ke user
  bot.sendMessage(chatId, '📸 Foto diterima! Terima kasih.');
  
  // Catat ke database (nanti pakai Firebase)
  console.log(`📸 Photo dari ${chatId}, file_id: ${fileId}`);
  
  // Template Firebase:
  // const db = require('firebase-admin').database();
  // db.ref(`uploads/${chatId}`).push({
  //   type: 'photo',
  //   fileId: fileId,
  //   timestamp: new Date().toISOString(),
  //   status: 'processed'
  // });
};