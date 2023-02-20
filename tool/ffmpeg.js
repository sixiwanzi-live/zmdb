import { spawn } from 'child_process';
import config from './config.js';

export const toAudio = async (videoUrl, filepath) => {
    const cmd = [
        '-y',
        '-user_agent', config.segment.userAgent, 
        '-headers', `Referer: ${config.segment.referer}`,
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

export const segment = async (src, dst, start, end) => {
    const cmd = [
        '-y',
        '-ss', start, 
        '-to', end,
        '-i', src,
        '-c', 'copy',
        dst
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