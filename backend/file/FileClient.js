import { unlink, writeFile, rename, mkdir } from 'fs/promises';
import Sharp from "sharp";
import config from '../config.js';

export default class FileClient {

    constructor() {}

    save = async (path, content) => {
        await writeFile(`${config.web.staticDir}/${path}`, content);
    }

    mkdir = async (path) => {
        await mkdir(path, { recursive: true });
    }

    move = async (src, dst) => {
        const srcPath = `${config.web.tmpDir}/${src}`;
        const dstPath = `${config.web.staticDir}/${dst}`;
        await rename(srcPath, dstPath)
    }

    delete = async (src) => {
        try {
            const srcPath = `${config.web.staticDir}/${src}`;
            await unlink(srcPath);
        } catch (e) {}
    }

    changeImageType = async (src) => {
        const dst = src.substring(0, src.lastIndexOf('.')) + '.' + config.web.imageType;
        await Sharp(`${config.web.tmpDir}/${src}`).toFile(`${config.web.tmpDir}/${dst}`);
        return dst;
    }

}