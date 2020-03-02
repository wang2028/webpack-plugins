const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require("path");

var app = express();
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

let webappPath = path.resolve(__dirname, '../dist'); // 将 /dist 设为静态文件目录
app.use(express.static(webappPath));

// 热更新后端接口：
app.post("/api/hot-update", function (req, res) {
    // 验证key：
    if (req.body.key !== '123456') {
        res.status(403);
        res.end();
        return;
    }
    // 读取上传的文件：
    let buf = Buffer.from(req.body.file.data);
    // 将文件更新到 /dist 目录，完成热更新：
    fs.writeFile(path.resolve(webappPath, req.body.filename), buf, function (err) {
        if (err) {
            console.error('写入文件错误：', err);
            res.status(500);
        }
        else {
            console.log("发布成功:", req.body.filename, (new Date()).toLocaleDateString(), (new Date()).toLocaleTimeString());
            res.status(200);
        }
        res.end();
    });
})


//使用 nginx 反向代理 或 在本地调试：
var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("访问地址为 http://%s:%s", host.toString(), port.toString());
});

