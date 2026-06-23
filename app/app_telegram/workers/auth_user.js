// Catatan: Worker ini akan terkoneksi ke Firebase nanti.
// Untuk sekarang, kita hanya log ke console.

module.exports = (chatId, userData) => {
  // Sementara kita simpan di memori / log
  console.log(`🔐 Auth User: ${chatId} (${userData.username || 'no username'})`);
  
  // Nanti di sini kita simpan ke Firebase:
  // const db = require('firebase-admin').database();
  // db.ref(`users/${chatId}`).set({ ... });
  
  return true;
};