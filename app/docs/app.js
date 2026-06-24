// Inisialisasi SDK Mini App Telegram
if (window.Telegram && window.Telegram.WebApp) {
    const webapp = window.Telegram.WebApp;
    webapp.ready();
    webapp.expand(); // Membuka Mini App layar penuh otomatis agar tidak stuck
    
    // Tampilkan nama Telegram user asli di badge atas
    const user = webapp.initDataUnsafe.user;
    if (user) {
        document.getElementById('userBadge').textContent = `👤 ${user.first_name}`;
    } else {
        document.getElementById('userBadge').textContent = `👤 Tamu`;
    }
}

document.getElementById('btnSend').addEventListener('click', function() {
    const fileInput = document.getElementById('filePicker');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Silakan pilih file terlebih dahulu!');
        return;
    }

    // Validasi maksimal ukuran file 1 GB
    const maxSizeInBytes = 1024 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        alert('Ukuran file terlalu besar! Batas maksimal adalah 1 GB.');
        return;
    }

    const progressWrapper = document.getElementById('progressWrapper');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressStatus = document.getElementById('progressStatus');
    
    progressWrapper.style.display = 'block';
    progressStatus.textContent = 'Mengunggah di latar belakang...';

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    // Melacak pergerakan progres 0-100% yang sesungguhnya di latar belakang
    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = percent + '%';
            progressPercent.textContent = percent + '%';
        }
    });

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                progressStatus.textContent = 'Selesai! Berhasil masuk Channel V.';
                addHistory(file.name);
                fileInput.value = '';
            } else {
                progressStatus.textContent = 'Gagal mengunggah berkas.';
                alert('Gagal mengirim ke server backend.');
            }
        }
    };

    // Hubungkan frontend ke hosting backend Anda (Ubah URL ini nanti)
    const BACKEND_URL = 'https://ganti-dengan-url-render-anda.onrender.com';
    xhr.open('POST', `${BACKEND_URL}/api/upload`, true);
    xhr.send(formData);
});

function addHistory(fileName) {
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');
    
    if (historyEmpty) historyEmpty.remove();
    
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + '.' + now.getMinutes().toString().padStart(2, '0');
    
    const item = document.createElement('div');
    item.className = 'history-item';
    
    let icon = '📄';
    if (fileName.endsWith('.mp4') || fileName.endsWith('.mkv') || fileName.endsWith('.avi')) {
        icon = '🎬';
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')) {
        icon = '🖼️';
    }
    
    item.innerHTML = `
        <div class="file-info">${icon} ${fileName}</div>
        <div class="time-stamp">${timeString}</div>
    `;
    historyList.insertBefore(item, historyList.firstChild);
}

document.getElementById('btnClose').addEventListener('click', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
    } else {
        alert('Aplikasi ditutup.');
    }
});
