const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')

const button = document.querySelector("button");
button.onclick = function () {
  mediaRecorder.addEventListener("dataavailable", (e) => {
    console.log(e.data);
    // 将数据发送到后台
    // 发送时 e.data 的类型是 Blob
    // ws.send(e.data);
    e.data.arrayBuffer().then(buffer => {
        ipcRenderer.send('vedio-data', buffer)
    })
    
  });

  // 开始录制并每隔 1s 发送一次数据
  mediaRecorder.start(1000);
  drawVedio();
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  function drawVedio() {
    setTimeout(() => {
      canvas.getContext("2d").drawImage(video, 0, 0, 100, 100);
      drawVedio();
    }, 0);
  }
};
