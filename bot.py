import os
import telebot

# 🔑 Mengambil Token Bot dan ID Saluran dari Environment Variables demi keamanan
BOT_TOKEN = os.environ.get('BOT_TOKEN')
# Masukkan username saluran kamu (gunakan tanda @ di depannya)
CHANNEL_ID = "@vvbbvvpp"

bot = telebot.TeleBot(BOT_TOKEN)

# 🎥 Fungsi untuk menangkap setiap kiriman video dari pengguna
@bot.message_handler(content_types=['video'])
def forward_video(message):
    try:
        # Kirim ulang video tersebut langsung ke saluran publik kamu
        bot.send_video(chat_id=CHANNEL_ID, video=message.video.file_id, caption=message.caption)
        # Berikan pesan konfirmasi otomatis kepada pengguna yang mengirim
        bot.reply_to(message, "✅ Terima kasih! Video kamu telah otomatis diterbitkan ke saluran.")
    except Exception as e:
        bot.reply_to(message, f"❌ Gagal mengirim video. Error: {str(e)}")

# 🚀 Menjalankan bot secara terus-menerus
if __name__ == "__main__":
    print("Bot sedang berjalan...")
    bot.infinity_polling()
