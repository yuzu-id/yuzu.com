document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const uploadBtn = document.getElementById('uploadBtn');
  const statusEl = document.getElementById('status');

  // Ganti dengan URL server bot Anda yang sudah di-deploy (bukan localhost!)
  const BOT_SERVER_URL = 'https://bot-anda.herokuapp.com'; // <-- GANTI!

  let selectedFiles = [];

  // Ketika user pilih file
  fileInput.addEventListener('change', function(e) {
    selectedFiles = Array.from(e.target.files);
    renderFileList();
    uploadBtn.disabled = selectedFiles.length === 0;
    statusEl.className = 'status';
    statusEl.textContent = `${selectedFiles.length} video dipilih`;
  });

  function renderFileList() {
    if (selectedFiles.length === 0) {
      fileList.innerHTML = '<div class="file-item" style="justify-content:center;color:#94a3b8;">Belum ada video dipilih</div>';
      return;
    }
    fileList.innerHTML = selectedFiles.map((file, index) => `
      <div class="file-item">
        <span>🎬 ${file.name}</span>
        <span class="size">${(file.size / 1024 / 1024).toFixed(1)} MB</span>
      </div>
    `).join('');
  }

  // Tombol Upload
  uploadBtn.addEventListener('click', async function() {
    if (selectedFiles.length === 0) return;

    uploadBtn.disabled = true;
    statusEl.className = 'status loading';
    statusEl.textContent = '⏳ Mengupload...';

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', `Video ${i+1} dari ${selectedFiles.length}`);

      try {
        const response = await fetch(`${BOT_SERVER_URL}/upload`, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
        console.error(`Gagal upload ${file.name}:`, error);
      }

      // Update status per video
      statusEl.textContent = `⏳ Mengupload ${i+1}/${selectedFiles.length}... (Berhasil: ${successCount}, Gagal: ${failCount})`;
    }

    // Selesai
    if (failCount === 0) {
      statusEl.className = 'status success';
      statusEl.textContent = `✅ Semua ${successCount} video berhasil dikirim ke channel!`;
    } else if (successCount === 0) {
      statusEl.className = 'status error';
      statusEl.textContent = `❌ Gagal mengirim semua video (${failCount} gagal)`;
    } else {
      statusEl.className = 'status warning';
      statusEl.textContent = `⚠️ ${successCount} berhasil, ${failCount} gagal`;
    }

    // Reset
    selectedFiles = [];
    fileInput.value = '';
    renderFileList();
    uploadBtn.disabled = true;
    uploadBtn.disabled = false;
  });
});