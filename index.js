const { app, BrowserWindow } = require("electron");
const path = require("path");
const Stream = require("stream");
const net = require("net");
const pathToFfmpeg = require("ffmpeg-static");
const { spawn } = require("child_process");
const fs = require('fs');


const RTMP_SERVER =
  "rtmp://localhost:1935/live/rfBd56ti2SMtYvSgD5xAV0YU99zampta7Z7S575KLkIZ9PYk";

const ffmpeg = spawn(pathToFfmpeg, [
  // 从 stdin 中读入视频数据
  // '-re',
  // '-f', 'lavfi',
  // '-i', 'anullsrc',

  "-i",
  "-",
  // '-i', './demo.flv',

  // 视频转码
  // 由于视频已经是 H.264 编码，可以直接复制
  // 若需要转码则填 libx264
  "-vcodec",
  "copy",
  // "-c", "copy",
  // 音频转码
  "-acodec",
  "aac",

  // 输出为 flv 格式
  "-f",
  "flv",

  // RTMP 服务器
  RTMP_SERVER,
  // UDP
]);

// ffmpeg.stderr.on("data", (data) => {
//   console.error(`${data}`);
// });

// ffmpeg.stdout.on("data", (d) => {
//   console.log(d);
//   console.log("=====");
// });

// const readableStream = new Stream.Writable()

// const ffmpeg = require('fluent-ffmpeg');
//Get the paths to the packaged versions of the binaries we want to use
// const ffmpegPath = require('ffmpeg-static');
// .replace(
//     'app.asar',
//     'app.asar.unpacked'
// );
// const ffprobePath = require('ffprobe-static').path;
// .replace(
//     'app.asar',
//     'app.asar.unpacked'
// );
// console.log({
//     ffmpegPath,
//     ffprobePath
// })

// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// const rwStream =

// const output = "rtmp://10.200.197.253:1935/live/rfBd56ti2SMtYvSgD5xAV0YU99zampta7Z7S575KLkIZ9PYk";

//tell the ffmpeg package where it can find the needed binaries.
// const cmd = ffmpeg()
//     .addInput(readableStream)
//     .setFfmpegPath(ffmpegPath)
//     .setFfprobePath(ffprobePath)
//     .inputOptions('-re')
//     .addOptions([
//         "-c copy"
//     ])
//     .format('flv');

// cmd.output(output, {
//     end: true
// }).run()

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

const { ipcMain } = require("electron");
ipcMain.on("asynchronous-message", (event, arg) => {
  console.log(arg); // prints "ping"
  event.reply("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, arg) => {
  console.log(arg); // prints "ping"
  event.returnValue = "pong";
});

// const client = net.createConnection(
//   { port: 8124, host: "10.200.16.17" },
//   () => {
//     // 'connect' listener.
//     console.log("connected to server!");
//   client.write('world!\r\n');
ipcMain.on("vedio-data", (event, arg) => {
  let buffer = Buffer.from(arg);
  // console.log({ buffer }); // prints "ping"
  // event.returnValue = "pong";
  // readableStream.write(buffer)
  // client.write(buffer);
  ffmpeg.stdin.write(buffer);
  // fs.appendFile('./veido.flv', buffer, () => {

  // })
});
//   }
// );
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });
