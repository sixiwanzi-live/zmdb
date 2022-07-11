import { pinyin } from 'pinyin-pro';

export class Srt {

    constructor() {}

    toTS = (time) => {
        const vec = time.split(/[:|,]/);
        const ms = parseInt(vec[3]);
        const s = parseInt(vec[2]);
        const m = parseInt(vec[1]);
        const h = parseInt(vec[0]);
        return ms + s * 1000 + m * 60 * 1000 + h * 60 * 60 * 1000;
    }

    parse = (content) => {
        let r = new Array();
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i += 4) {
            if (lines[i] !== '') {
                const duration = lines[i + 1].split(' --> ');
                r.push({
                    lineId: lines[i],
                    start: this.toTS(duration[0]),
                    end: this.toTS(duration[1]),
                    content: lines[i + 2],
                    pinyinContent: pinyin(lines[i + 2], {toneType:'num'})
                });
            }
        }
        return r;
    }
}

export const toExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.'));
}

export const mark = (content, keyword) => {
    // 清理空白字符，避免拼音转换异常
    content = content.replace(/\s+/g,"^");
    // 对于完全匹配的内容，直接进行替换
    content = content.replaceAll(keyword, `[${keyword}]`);

    const pinyinContentArray = pinyin(content, {toneType:'num', type:'array'});
    // console.log(`content.length:${content.length},pinyinContent.length:${pinyinContentArray.length}`);

    const pinyinKeywordArray = pinyin(keyword, {toneType:'num', type:'array'});

    // 找到所有同音词
    let matchedKeywords = new Set();
    let p = 0;
    while (p < pinyinContentArray.length) {
        let flag = true;
        for (let i = 0; i < pinyinKeywordArray.length; ++i) {
            if (pinyinKeywordArray[i] !== pinyinContentArray[p + i]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            const matchedKeyword = content.substring(p, p + keyword.length);
            if (matchedKeyword !== keyword) {
                matchedKeywords.add(matchedKeyword);
            }
            p += pinyinKeywordArray.length;
        } else {
            p += 1;
        }
    }

    // 将匹配到的同音词，在原文中打上标记
    let r = content;
    matchedKeywords.forEach(matchedKeyword => {
        r = r.replaceAll(matchedKeyword, `{${matchedKeyword}}`);
    });
    // 还原空白字符
    r = r.replaceAll('^', ' ');
    return r;
};