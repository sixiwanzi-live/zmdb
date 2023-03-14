import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import flvjs from 'flv.js';
import Hls from 'hls.js';

export default function Player({ option, getInstance, ...rest }) {
    const artRef = useRef();

    useEffect(() => {
        const art = new Artplayer({
            ...option,
            container: artRef.current,
            // autoSize: true,
            screenshot: true,
            setting: true,
            fullscreen: true,
            fullscreenWeb: true,
            fastForward: true,
            playbackRate: true,
            customType: {
                flv: function (video, url) {
                    if (flvjs.isSupported()) {
                        const flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            url: url,
                        });
                        flvPlayer.attachMediaElement(video);
                        flvPlayer.load();
                    } else {
                        art.notice.show = '不支持播放flv';
                    }
                },
                m3u8: function (video, url) {
                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    } else {
                        art.notice.show = '不支持播放格式：m3u8';
                    }
                },
                plugins: [
                    artplayerPluginDanmuku({
                        // 弹幕 XML 文件，和 Bilibili 网站的弹幕格式一致
                        danmuku: `https://seg.bili.studio:8443/5/柚恩不加糖/2023-03/20230312-201402-柚恩不加糖-【电台】柚来聊聊天.xml`
                    }),
                ],
            },
        });

        art.on('ready', () => {
            art.play();
        })

        if (getInstance && typeof getInstance === 'function') {
            getInstance(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, []);

    return <div ref={artRef} {...rest}></div>;
}