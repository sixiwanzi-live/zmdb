export const fromMicroseconds = (microseconds) => {
    const ms = parseInt(microseconds % 1000);
    const seconds = parseInt(microseconds / 1000);
    const ss = parseInt(seconds % 60);
    const minutes = parseInt(seconds / 60);
    const mm = parseInt(minutes % 60);
    const hh = parseInt(minutes / 60);
    return `${hh.toString().padStart(2, 0)}:${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)},${ms.toString().padStart(3, 0)}`;
}

export const toSrt = (subtitles) => {
    return subtitles.map(subtitle =>
        `${subtitle.lineId}\r\n${fromMicroseconds(subtitle.start)}\r\n${fromMicroseconds(subtitle.end)}\r\n${subtitle.content}\r\n`
    ).join('\r\n');
}