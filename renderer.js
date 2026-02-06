document.getElementById('start').addEventListener('click', function () {
  document.getElementById('thongbao').classList.add('hidden')
  let pathFileMail = document.getElementById('filepathmail').value;
  let pathFileProxyHotmail = document.getElementById('filepathproxyhotmail').value;
  let pathFileProxyApple = document.getElementById('filepathproxyapple').value;
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
  if (pathFileProxyHotmail[0] == '"') {
    pathFileProxyHotmail = pathFileProxyHotmail.substring(1)
  }
  if (pathFileProxyHotmail[pathFileProxyHotmail.length - 1] == '"') {
    pathFileProxyHotmail = pathFileProxyHotmail.substring(0, pathFileProxyHotmail.length - 1)
  }
  if (pathFileProxyApple[0] == '"') {
    pathFileProxyApple = pathFileProxyApple.substring(1)
  }
  if (pathFileProxyApple[pathFileProxyApple.length - 1] == '"') {
    pathFileProxyApple = pathFileProxyApple.substring(0, pathFileProxyApple.length - 1)
  }
  window.electronAPI.start(pathFileMail, pathFileProxyHotmail, pathFileProxyApple, soluong);
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