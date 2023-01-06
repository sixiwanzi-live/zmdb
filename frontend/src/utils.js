export const toTime = (timestamp) => {
    const ms = parseInt(timestamp % 1000);
    timestamp = parseInt(timestamp / 1000);
    const s = parseInt(timestamp % 60);
    timestamp = parseInt(timestamp/ 60);
    const m = parseInt(timestamp % 60);
    const h = parseInt(timestamp / 60);
    return `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)},${ms.toString().padStart(3, 0)}`;
}

export const toSrt = (subtitles) => {
    return subtitles.map(subtitle =>
        `${subtitle.lineId}\r\n${toTime(subtitle.start)}\r\n${toTime(subtitle.end)}\r\n${subtitle.content}\r\n`
    ).join('\r\n');
}