import { spawn } from 'child_process';

export const toAudio = async (videoUrl, filepath) => {
    const cmd = [
        '-y',
        '-user_agent', "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.27", 
        '-headers', `Referer: https://www.bilibili.com`,
        '-i', videoUrl,
        '-vn', 
        '-codec', 'copy',
        filepath
    ];
    await new Promise((res, rej) => {
        let p = spawn('ffmpeg', cmd);
        p.stdout.on('data', (data) => {
            console.log('stdout: ' + data.toString());
        });
        p.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString());
        });
        p.on('close', (code) => {
            console.log(`ffmpeg退出:code:${code}`);
            res();
        });
        p.on('error', (error) => {
            rej(error);
        });
    });
}