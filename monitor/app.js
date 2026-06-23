// ==========================================
// v1.0 - DASHBOARD ADMIN (Data Dummy)
// Nanti di v1.1 akan terhubung ke Firebase
// ==========================================

// ==========================================
// 1. ELEMEN DOM
// ==========================================
const totalSpan = document.getElementById('totalUpload');
const userSpan = document.getElementById('activeUsers');
const todaySpan = document.getElementById('todayUpload');
const botStatusSpan = document.getElementById('botStatus');
const updateTimeSpan = document.getElementById('updateTime');
const channelList = document.getElementById('channelList');
const refreshBtn = document.getElementById('refreshBtn');

// ==========================================
// 2. DATA DUMMY (CONTOH)
// ==========================================
const dummyData = {
  totalUpload: 1234,
  activeUsers: 56,
  todayUpload: 17,
  botStatus: '🟢 Online',
  // Data grafik (7 hari terakhir)
  chartData: [12, 19, 8, 15, 22, 9, 14],
  // Data 5 channel
  channels: [
    { name: 'Channel Alpha', status: 'online', members: 1240 },
    { name: 'Channel Beta', status: 'offline', members: 0 },
    { name: 'Channel Gamma', status: 'online', members: 890 },
    { name: 'Channel Delta', status: 'maintenance', members: 450 },
    { name: 'Channel Epsilon', status: 'online', members: 2100 }
  ]
};

// ==========================================
// 3. RENDER FUNGSI
// ==========================================
function renderStats(data) {
  totalSpan.textContent = data.totalUpload.toLocaleString();
  userSpan.textContent = data.activeUsers.toLocaleString();
  todaySpan.textContent = data.todayUpload.toLocaleString();
  botStatusSpan.textContent = data.botStatus;
  
  // Waktu update
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

// ==========================================
// 4. GRAFIK (Chart.js)
// ==========================================
const ctx = document.getElementById('activityChart').getContext('2d');
const activityChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [{
      label: 'Jumlah Upload',
      data: dummyData.chartData,
      backgroundColor: '#1a73e8',
      borderRadius: 6,
      barPercentage: 0.6
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' }
      },
      x: {
        grid: { display: false }
      }
    }
  }
});

// ==========================================
// 5. FUNGSI UPDATE (untuk refresh data)
// ==========================================
function updateDashboard() {
  // Di v1.0 kita pakai data dummy, tapi dengan nilai yang sedikit berubah
  // agar terlihat "hidup"
  const newTotal = dummyData.totalUpload + Math.floor(Math.random() * 5);
  const newToday = dummyData.todayUpload + Math.floor(Math.random() * 3);
  const newUsers = dummyData.activeUsers + Math.floor(Math.random() * 2);
  
  // Update stats
  totalSpan.textContent = newTotal.toLocaleString();
  userSpan.textContent = newUsers.toLocaleString();
  todaySpan.textContent = newToday.toLocaleString();
  
  // Update grafik (geser data)
  const newData = activityChart.data.datasets[0].data;
  newData.shift();
  newData.push(Math.floor(Math.random() * 20) + 5);
  activityChart.update();
  
  // Update waktu
  const now = new Date();
  updateTimeSpan.textContent = now.toLocaleTimeString('id-ID');
  
  // Update bot status (kadang berubah)
  const statuses = ['🟢 Online', '🟡 Sibuk', '🟢 Online', '🟢 Online'];
  const rand = Math.floor(Math.random() * statuses.length);
  botStatusSpan.textContent = statuses[rand];
  botStatusSpan.style.color = rand === 0 ? '#28a745' : (rand === 1 ? '#ffc107' : '#28a745');
}

// ==========================================
// 6. EVENT LISTENER & INISIALISASI
// ==========================================
refreshBtn.addEventListener('click', updateDashboard);

// Render awal
renderStats(dummyData);
renderChannels(dummyData.channels);

// Auto-refresh setiap 30 detik (biar dashboard terasa real-time)
setInterval(updateDashboard, 30000);

console.log('📊 Dashboard yuzu.com v1.0 siap!');
console.log('ℹ️  Data masih dummy, akan dihubungkan ke Firebase di v1.1');