document.addEventListener('DOMContentLoaded', function() {
  const statusEl = document.getElementById('status');
  const buttons = document.querySelectorAll('.media-btn');

  // Ganti dengan URL server bot Anda (contoh: https://bot-anda.herokuapp.com)
  const BOT_SERVER_URL = 'http://localhost:3000';

  buttons.forEach(btn => {
    btn.addEventListener('click', async function() {
      const type = this.dataset.type;
      const url = this.dataset.url;
      const caption = this.dataset.caption || '';

      statusEl.className = 'status loading';
      statusEl.textContent = '⏳ Mengirim...';

      try {
        let endpoint = '';
        let payload = {};

        if (type === 'video') {
          endpoint = '/send-video';
          payload = { videoUrl: url, caption };
        } else if (type === 'photo') {
          endpoint = '/send-photo';
          payload = { photoUrl: url, caption };
        } else {
          throw new Error('Tipe media tidak dikenal');
        }

        const response = await fetch(`${BOT_SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          statusEl.className = 'status success';
          statusEl.textContent = '✅ Berhasil dikirim ke channel!';
        } else {
          throw new Error(result.error || 'Gagal mengirim');
        }
      } catch (error) {
        statusEl.className = 'status error';
        statusEl.textContent = `❌ ${error.message}`;
        console.error(error);
      }
    });
  });
});