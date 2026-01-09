document.getElementById('start').addEventListener('click', function () {
  document.getElementById('thongbao').classList.add('hidden')
  let pathFileMail = document.getElementById('filepathmail').value;
  let soluong = document.getElementById('soluong').value || 0;
  if (soluong < 1 || soluong > 10) {
    soluong = 10;
  }
  if (pathFileMail[0] == '"') {
    pathFileMail = pathFileMail.substring(1)
  }
  if (pathFileMail[pathFileMail.length - 1] == '"') {
    pathFileMail = pathFileMail.substring(0, pathFileMail.length - 1)
  }
  window.electronAPI.start(pathFileMail, soluong);
});

document.getElementById('pause').addEventListener('click', function () {
  window.electronAPI.pause();
});
document.getElementById('result').addEventListener('click', function () {
  let pathFileMail = document.getElementById('filepathmail').value;
  if (pathFileMail[0] == '"') {
    pathFileMail = pathFileMail.substring(1)
  }
  if (pathFileMail[pathFileMail.length - 1] == '"') {
    pathFileMail = pathFileMail.substring(0, pathFileMail.length - 1)
  }
  window.electronAPI.result(pathFileMail)
})