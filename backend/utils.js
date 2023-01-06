import { pinyin } from 'pinyin-pro';

export const toMicroseconds = (str) => {
    const vec = str.split(/[:|,]/);
    const ms = parseInt(vec[3]);
    const s = parseInt(vec[2]);
    const m = parseInt(vec[1]);
    const h = parseInt(vec[0]);
    return ms + s * 1000 + m * 60 * 1000 + h * 60 * 60 * 1000;
};

export const fromMicroseconds = (microseconds) => {
    const ms = parseInt(microseconds % 1000);
    const seconds = parseInt(microseconds / 1000);
    const ss = parseInt(seconds % 60);
    const minutes = parseInt(seconds / 60);
    const mm = parseInt(minutes % 60);
    const hh = parseInt(minutes / 60);
    return `${hh.toString().padStart(2, 0)}:${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)},${ms.toString().padStart(3, 0)}`;
}

export const checkTimeFormat = (timestamp) => {
    const regex = /^[\d]{2}\:[\d]{2}\:[\d]{2}\,[\d]{3}/g;
    return regex.test(timestamp);
}

export const parse = (content) => {
    let r = new Array();
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i += 4) {
        if (lines[i] !== '') {
            const duration = lines[i + 1].split(' --> ');
            r.push({
                lineId: lines[i],
                start: toMicroseconds(duration[0]),
                end: toMicroseconds(duration[1]),
                content: lines[i + 2],
                pinyinContent: pinyin(lines[i + 2], {toneType:'num'})
            });
        }
    }
    return r;
}

export const mark = (content, keywordPattern, pinyinKeywordPattern) => {
    let matchedRange = new Map();
    // 找出需要高亮的区域
    const matchedContent = content.replace(new RegExp(keywordPattern, 'g'), '[$&]');
    if (matchedContent !== content) {
        // console.log(matchedContent);
        let word = 0;
        let start = 0;      // 当前需要高亮的汉字起始点位置
        let end = 0;        // 当前需要高亮的汉字结束点位置
        for (let i = 0; i < matchedContent.length; ++i) {
            const c = matchedContent.charAt(i);
            if (c === '[') {
                start = word;
            } else if (c === ']') {
                end = word;
                // console.log(start, end);
                // console.log(content.substring(start, end));
                matchedRange.set(`${start}:${end}`, [start, end]);
                start = 0; // 复位，查找下一个匹配
                end = 0;  // 复位，查找下一个匹配
            } else {
                word++;
            }
        }
    }

    let pinyinContent = pinyin(content, {toneType:'num'});
    // 将通配符转换成正则表达式格式的拼音字符串
    // 找出需要高亮的区域
    const matchedPinyinContent = pinyinContent.replace(new RegExp(pinyinKeywordPattern, 'g'), '[$&]');
    if (matchedPinyinContent !== pinyinContent) {
        let whitespace = 0; // 目前一共扫描出多少个空格符
        let start = 0;      // 当前需要高亮的汉字起始点位置
        let end = 0;        // 当前需要高亮的汉字结束点位置
        for (let i = 0; i < matchedPinyinContent.length; ++i) {
            const c = matchedPinyinContent.charAt(i);
            if (c === ' ') {
                whitespace++;
            } else if (c === '[') {
                start = whitespace;
            } else if (c === ']') {
                end = whitespace + 1;
                matchedRange.set(`${start}:${end}`, [start, end]);
                start = 0; // 复位，查找下一个匹配
                end = 0;  // 复位，查找下一个匹配
            }
        }
    }
    let r = content;
    if (matchedRange.size > 0) {
        let ranges = [...matchedRange.values()].sort((a, b) => a[0] <= b[0]);
        for (let i = 0; i < ranges.length; ++i) {
            const range = ranges[i];
            r = r.slice(0, range[0] + 2 * i) + '[' + r.slice(range[0] + 2 * i);
            r = r.slice(0, range[1] + 2 * i + 1) + ']' + r.slice(range[1] + 2 * i + 1);
        }
    }
    return r;
};
