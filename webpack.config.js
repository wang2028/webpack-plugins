const path = require("path");
const UploadServer = require('./webpack_plugins/UploadServer');

module.exports = (env, args) => {
    
    return {
        mode: 'production',
        // ... 一些其他东西
        plugins: [
            // ... 一些其他插件
            new UploadServer({
                url: 'https://xxx.com/api/update', // http://localhost:83/api/updateDist
                key: 'xxxxxx',   // 作为后端的验证
                exec: true, // 默认在生产模式下上传。若不想上传，可置为 false
            }),
        ],
        module: {
            rules: [
                // ...
            ]
        }
    }
}