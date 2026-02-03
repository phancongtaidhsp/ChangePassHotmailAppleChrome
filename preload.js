const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  start: (pathFileMail, soluong, daisySMSApiKey) => ipcRenderer.send('start', pathFileMail, soluong, daisySMSApiKey),
  pause: () => ipcRenderer.send('pause'),
  result: (pathFileMail) => ipcRenderer.send('result', pathFileMail)
})

window.addEventListener('DOMContentLoaded', () => {
  function showThongBao(type, message, isTimeout) {
    document.getElementById('thongbao').innerText = message;
    document.getElementById('thongbao').className = `alert ${type}`;
    document.getElementById('thongbao').classList.remove('hidden')
    if (!isTimeout) {
      setTimeout(() => document.getElementById('thongbao').classList.add('hidden'), 3000);
    }
  }
  ipcRenderer.on('total', function (e, total) {
    document.getElementById(`total`).innerText = total;
  })
  ipcRenderer.on('fail', function (e, step, pause) {
    let failStep = parseInt(document.getElementById(`die`).innerText) + step;
    document.getElementById(`die`).innerText = failStep;
  })
  ipcRenderer.on('success', function (e, step, pause) {
    let successStep = parseInt(document.getElementById(`live`).innerText) + step;
    document.getElementById(`live`).innerText = successStep;
  })
  ipcRenderer.on('tocheck', function (e, step, pause) {
    let tocheckStep = parseInt(document.getElementById(`tocheck`).innerText) + step;
    document.getElementById(`tocheck`).innerText = tocheckStep;
  })
  ipcRenderer.on('disable', function (e, isDisable) {
    document.getElementById('start').disabled = isDisable;
    document.getElementById('result').disabled = isDisable;
  })
  ipcRenderer.on('time', function (e, time) {
    let h, m, s
    if (time / 3600 >= 1) {
      h = Math.floor(time / 3600);
      s = time % 3600;
      m = 0;
      if (s / 60 >= 1) {
        m = Math.floor(s / 60);
        s = s % 60;
      }
      document.getElementById(`time`).innerText = `${h}h${m}m${s}s`
    } else if (time / 60 >= 1) {
      m = Math.floor(time / 60)
      s = time % 60
      document.getElementById(`time`).innerText = `0h${m}m${s}s`
    } else {
      document.getElementById(`time`).innerText = `0h0m${time}s`
    }
  })
  ipcRenderer.on('done', function (e, isDone) {
    if (isDone) {
      showThongBao('alert-success', 'Đã chạy hết file data')
    }
  })
  ipcRenderer.on('checkfiles', function (e, filename) {
    showThongBao('alert-danger', `Đường dẫn file không hợp lệ: ${filename}`)
  })
  ipcRenderer.on('pause', function (e, info, noTimeout) {
    showThongBao('alert-info', info, noTimeout)
    document.getElementById('start').disabled = isDisable;
  })
  ipcRenderer.on('loi', function (e, err, noTimeout) {
    showThongBao('alert-danger', err, noTimeout)
  })
  ipcRenderer.on('result', function (e, isSuccess) {
    if (isSuccess) {
      showThongBao('alert-success', 'Xuất kết quả thành công')
    }
    else {
      showThongBao('alert-danger', 'Xuất kết quả thất bại')
    }
  })
})