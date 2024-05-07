const axios = require('axios');
const fse = require('fs-extra');
const url=require('./data')

// 远程hosts文件的URL
const remoteHostsUrl = url;

// 本地hosts文件路径（Windows下的默认路径）
const localHostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';

async function appendRemoteHostsToLocal() {
    try {
        // 设置超时为5秒
        const response = await axios.get(remoteHostsUrl, { timeout: 5000 }); // 5000毫秒即5秒
        
        if (response.status === 200) {
            // 读取本地hosts文件的现有内容
            let currentContent = await fse.readFile(localHostsPath, 'utf8');
            
            // 检查并追加新内容，这里假设远程内容是以换行分隔的
            const newContentLines = response.data.split('\n').filter(line => line.trim() !== ''); // 去除空行
            const updatedContent = `${currentContent}\n${newContentLines.join('\n')}\n`; // 追加新行并保持格式
            
            // 写入更新后的内容到本地hosts文件，需要管理员权限
            await fse.writeFile(localHostsPath, updatedContent, 'utf8');
            
            console.log('远程hosts文件内容已成功追加到本地hosts文件。');
        } else {
            throw new Error(`下载远程hosts文件失败，状态码：${response.status}`);
        }
    } catch (error) {
        console.error('执行过程中发生错误:', error.message);
        // 根据需要可以在这里进行更详细的错误处理或通知
        throw error; // 重新抛出错误，以便外部调用者也能处理
    }
}

// 使用try-catch包裹整个函数调用，以便捕获并处理抛出的错误
(async () => {
    try {
        await appendRemoteHostsToLocal();
    } catch (error) {
        console.error('主程序捕获到错误:', error.message);
        // 可以在此处添加更多错误处理逻辑
    }
})();
