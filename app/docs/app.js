// ==========================================
// 1. INISIALISASI TELEGRAM WEBAPP
// ==========================================
const tg = window.Telegram?.WebApp;

// Variabel global untuk menyimpan data user
let userData = {
  id: 'anonymous',
  username: 'Tamu',
  first_name: 'Pengunjung'
};

if (tg) {
  tg.ready();
  tg.expand();

  if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    userData.id = user.id || 'anon';
    userData.username = user.username || user.first_name || 'User';
    userData.first_name = user.first_name || 'User';
  }

  // Tombol utama bawaan TG (optional, kita pakai tombol custom di HTML)
  tg.MainButton.text = "Tutup";
  tg.MainButton.onClick(() => tg.close());
  
} else {
  console.warn("Berjalan di luar Telegram (mode debug)");
  const params = new URLSearchParams(window.location.search);
  if (params.get('user')) {
    userData.id = params.get('user');
    userData.username = params.get('user');
  }
}

// Tampilkan nama user di header
document.getElementById('userName').textContent = userData.username || userData.first_name;

// ==========================================
// 2. FUNGSI UPLOAD & MANAJEMEN RIWAYAT
// ==========================================
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const statusDiv = document.getElementById('status');
const historyList = document.getElementById('historyList');

const STORAGE_KEY = `upload_history_${userData.id}`;
let history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<li style="color:#999; text-align:center; justify-content:center;">Belum ada upload</li>';
    return;
  }
  historyList.innerHTML = history.map(item => `
    <li>
      <span>📄 ${item.filename}</span>
      <span class="time">${item.time}</span>
    </li>
  `).join('');
}

function addHistory(filename) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  history.push({ filename, time: timeStr });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderHistory();
}

// Event Upload
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) {
    statusDiv.textContent = '⚠️ Pilih file terlebih dahulu!';
    statusDiv.style.color = 'var(--tg-theme-destructive-text-color, red)';
    return;
  }

  statusDiv.textContent = `⏳ Mengirim ${file.name}...`;
  statusDiv.style.color = 'var(--tg-theme-text-color, #333)';

  // SIMULASI PROSES (nanti diganti dengan fetch ke backend)
  setTimeout(() => {
    addHistory(file.name);
    statusDiv.textContent = `✅ Berhasil! (${file.name})`;
    statusDiv.style.color = 'var(--tg-theme-button-color, green)';
    fileInput.value = '';

    // ==========================================
    // TEMPLATE KIRIM KE BOT (AKTIFKAN NANTI)
    // ==========================================
    // kirimKeBot(file, userData);
    
  }, 1000);
});

// ==========================================
// 3. TOMBOL TUTUP
// ==========================================
document.getElementById('closeBtn').addEventListener('click', () => {
  if (tg) {
    tg.close();
  } else {
    window.close();
  }
});

// ==========================================
// 4. TEMPLATE FUNGSI KIRIM KE BOT
// ==========================================
/*
async function kirimKeBot(file, user) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', user.id);
  formData.append('username', user.username);

  try {
    const response = await fetch('https://your-backend.com/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log('Respon backend:', result);
  } catch (error) {
    console.error('Gagal kirim ke bot:', error);
  }
}
*/

// Render riwayat saat pertama kali dibuka
renderHistory();