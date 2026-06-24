// ============================================================
// monitor/app.js - DASHBOARD ADMIN (v1.0 Full Stable)
// ============================================================
// Fitur:
// - Data dummy statis + perubahan kecil saat refresh manual
// - Tombol Start/Stop auto-refresh (default: mati)
// - Grafik Chart.js dengan data 7 hari
// - Status 5 channel
// - Template Firebase untuk v1.1 (dikomentari)
// ============================================================

// ============================================================
// 1. ELEMEN DOM
// ============================================================
const totalSpan = document.getElementById('totalUpload');
const userSpan = document.getElementById('activeUsers');
const todaySpan = document.getElementById('todayUpload');
const botStatusSpan = document.getElementById('botStatus');
const updateTimeSpan = document.getElementById('updateTime');
const channelList = document.getElementById('channelList');
const refreshBtn = document.getElementById('refreshBtn');
const toggleAutoBtn = document.createElement('button'); // Tombol toggle auto-refresh

// Sisipkan tombol toggle di bawah refreshBtn
refreshBtn.parentNode.insertBefore(toggleAutoBtn, refreshBtn.nextSibling);
toggleAutoBtn.textContent = '⏸️ Pause Auto-Refresh';
toggleAutoBtn.style.cssText = `
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
`;
toggleAutoBtn.addEventListener('click', toggleAutoRefresh);

// ============================================================
// 2. DATA DUMMY (STABIL)
// ============================================================
const baseData = {
  totalUpload: 1234,
  activeUsers: 56,
  todayUpload: 17,
  botStatus: '🟢 Online',
  chartData: [12, 19, 8, 15, 22, 9, 14],
  channels: [
    { name: 'Channel Alpha', status: 'online', members: 1240 },
    { name: 'Channel Beta', status: 'offline', members: 0 },
    { name: 'Channel Gamma', status: 'online', members: 890 },
    { name: 'Channel Delta', status: 'maintenance', members: 450 },
    { name: 'Channel Epsilon', status: 'online', members: 2100 }
  ]
};

// State data saat ini (akan dimodifikasi sedikit saat refresh)
let currentData = JSON.parse(JSON.stringify(baseData));

// ============================================================
// 3. RENDER FUNGSI
// ============================================================
function renderStats(data) {
  totalSpan.textContent = data.totalUpload.toLocaleString();
  userSpan.textContent = data.activeUsers.toLocaleString();
  todaySpan.textContent = data.todayUpload.toLocaleString();
  botStatusSpan.textContent = data.botStatus;
  
  const now = new Date();
  updateTimeSpan.textContent = now.toLocaleTimeString('id-ID');
}

function renderChannels(channels) {
  channelList.innerHTML = channels.map(ch => {
    let statusClass = 'online';
    let statusText = 'Aktif';
    if (ch.status === 'offline') { statusClass = 'offline'; statusText = 'Tidak Aktif'; }
    else if (ch.status === 'maintenance') { statusClass = 'maintenance'; statusText = 'Maintenance'; }
    
    return `
      <li>
        <strong>${ch.name}</strong>
        <span class="status-badge ${statusClass}">${statusText}</span>
        <span style="font-size:13px;color:#888;">👥 ${ch.members}</span>
      </li>
    `;
  }).join('');
}

// ============================================================
// 4. GRAFIK (Chart.js)
// ============================================================
const ctx = document.getElementById('activityChart').getContext('2d');
const activityChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [{
      label: 'Jumlah Upload',
      data: currentData.chartData,
      backgroundColor: '#1a73e8',
      borderRadius: 6,
      barPercentage: 0.6
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
      x: { grid: { display: false } }
    }
  }
});

// ============================================================
// 5. UPDATE DASHBOARD (dengan perubahan kecil & realistis)
// ============================================================
function updateDashboard() {
  // Tambahkan sedikit variasi (1-3) agar terlihat "hidup", tapi tidak liar
  const deltaTotal = Math.floor(Math.random() * 3) + 1;  // +1 s/d +3
  const deltaToday = Math.floor(Math.random() * 2);      // 0 atau 1
  const deltaUsers = Math.floor(Math.random() * 2);      // 0 atau 1

  currentData.totalUpload += deltaTotal;
  currentData.todayUpload += deltaToday;
  currentData.activeUsers += deltaUsers;

  // Update grafik: geser ke kiri, tambah data baru (5-25)
  const newData = activityChart.data.datasets[0].data;
  newData.shift();
  const newValue = Math.floor(Math.random() * 20) + 5; // 5-25
  newData.push(newValue);
  activityChart.update();

  // Update status bot (kadang berubah, tapi tetap mayoritas online)
  const statusRoll = Math.random();
  if (statusRoll > 0.9) {
    currentData.botStatus = '🟡 Sibuk';
    botStatusSpan.style.color = '#ffc107';
  } else if (statusRoll > 0.95) {
    currentData.botStatus = '🔴 Offline';
    botStatusSpan.style.color = '#dc3545';
  } else {
    currentData.botStatus = '🟢 Online';
    botStatusSpan.style.color = '#28a745';
  }

  // Render ulang
  renderStats(currentData);
  renderChannels(currentData.channels);
}

// ============================================================
// 6. AUTO-REFRESH (Toggle On/Off)
// ============================================================
let autoRefreshInterval = null;
let autoRefreshActive = false;

function toggleAutoRefresh() {
  if (autoRefreshActive) {
    // Matikan
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    autoRefreshActive = false;
    toggleAutoBtn.textContent = '▶️ Start Auto-Refresh';
    toggleAutoBtn.style.background = '#28a745';
    toggleAutoBtn.style.color = 'white';
  } else {
    // Hidupkan
    autoRefreshInterval = setInterval(updateDashboard, 30000); // setiap 30 detik
    autoRefreshActive = true;
    toggleAutoBtn.textContent = '⏸️ Pause Auto-Refresh';
    toggleAutoBtn.style.background = '#ffc107';
    toggleAutoBtn.style.color = '#333';
    // Langsung update sekali agar tidak nunggu 30 detik
    updateDashboard();
  }
}

// ============================================================
// 7. EVENT LISTENER (Refresh Manual)
// ============================================================
refreshBtn.addEventListener('click', () => {
  updateDashboard();
  // Beri efek kilat pada tombol (feedback)
  refreshBtn.style.opacity = '0.6';
  setTimeout(() => { refreshBtn.style.opacity = '1'; }, 300);
});

// ============================================================
// 8. INISIALISASI AWAL
// ============================================================
renderStats(currentData);
renderChannels(currentData.channels);
updateTimeSpan.textContent = new Date().toLocaleTimeString('id-ID');

console.log('📊 Dashboard yuzu.com v1.0 (Full Stable)');
console.log('ℹ️  Data dummy. Auto-refresh OFF. Klik tombol hijau untuk aktifkan.');

// ============================================================
// 9. TEMPLATE FIREBASE (UNTUK v1.1 - DIKOMENTARI)
// ============================================================
/*
// --- Saat v1.1, aktifkan kode di bawah ini ---

// 1. Inisialisasi Firebase
const firebaseConfig = { ... };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. Listener data upload
db.ref('uploads').on('value', (snap) => {
  const data = snap.val();
  let total = 0, users = 0, today = 0;
  const now = new Date();
  const todayStr = now.toISOString().slice(0,10);
  
  if (data) {
    const userIds = Object.keys(data);
    users = userIds.length;
    userIds.forEach(uid => {
      const userUploads = data[uid];
      Object.values(userUploads).forEach(item => {
        total++;
        if (item.timestamp && item.timestamp.startsWith(todayStr)) {
          today++;
        }
      });
    });
  }
  
  currentData.totalUpload = total;
  currentData.activeUsers = users;
  currentData.todayUpload = today;
  renderStats(currentData);
});

// 3. Listener channel status (jika ada di Firebase)
db.ref('channels').on('value', (snap) => {
  const data = snap.val();
  if (data) {
    const channels = Object.values(data);
    renderChannels(channels);
    currentData.channels = channels;
  }
});

// 4. Update grafik dari data riil (7 hari terakhir)
db.ref('uploads').on('value', (snap) => {
  const data = snap.val();
  const dayCount = [0,0,0,0,0,0,0];
  const now = new Date();
  if (data) {
    Object.values(data).forEach(userUploads => {
      Object.values(userUploads).forEach(item => {
        const d = new Date(item.timestamp);
        const diff = Math.floor((now - d) / (1000*60*60*24));
        if (diff >= 0 && diff < 7) {
          dayCount[6 - diff]++;
        }
      });
    });
  }
  activityChart.data.datasets[0].data = dayCount;
  activityChart.update();
});

console.log('🔥 Firebase connected!');
*/