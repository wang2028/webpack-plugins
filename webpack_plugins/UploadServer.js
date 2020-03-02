const axios = require('axios');
const fs = require('fs');
const path = require('path');

class UploadServer {
    constructor(config) {
        this.config = config;
    }
    apply(compiler) {
        let me = this;
        // 判断打包模式，当为生产模式时才上传服务器：
        console.log("当前模式：", compiler.options.mode);
        if (compiler.options.mode !== 'production' || me.config.exec === false) {
            console.log("不上传服务器");
            return;
        }
        console.log("开始上传：");
        compiler.hooks.afterEmit.tapPromise('UploadServer', function (compilation) {
            let assets = compilation.assets;
            let promises = [];
            Object.keys(assets).forEach(function (filename, idx, arr) {
                promises.push(me.upload(filename));
            });
            return Promise.all(promises);
        });
    }
    upload(filename) {
        let me = this;
        return new Promise(function (resolve, reject) {
            let localPath = path.resolve(__dirname, "../dist", filename);
            fs.readFile(localPath, function (err, data) {
                if (err) {
                    console.error("fs 读取文件错误：", err);
                    reject(err);
                    return;
                }
                axios.post(me.config.url, {
                    filename: filename,
                    file: data,
                    key: me.config.key,
                }).then(function (res) {
                    console.log("上传文件成功：", filename);
                    resolve(res);
                }).catch(function (err) {
                    console.error("上传文件错误：", err);
                    reject(err);
                })
            });
        })
    }
}

module.exports = UploadServer;

// 上传测试：
// let filename = 'admin.html';
// let localPath = path.resolve(__dirname, "../dist", filename);
// console.log('local path:', localPath);
// fs.readFile(localPath, function (err, data) {
//     if (err) {
//         console.error("fs 读取文件错误：", err);
//         reject(err);
//         return;
//     }
//     axios.post('http://localhost:83/api/updateDist', {
//         filename: filename,
//         file: data,
//     }).then(function (res) {
//         console.log("上传文件成功：", filename);
//         // resolve(res);
//     }).catch(function (err) {
//         console.error("上传文件错误：", err);
//         // reject(err);
//     })
// });