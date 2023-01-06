import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import flvjs from 'flv.js';
import Hls from 'hls.js';

export default function Player({ option, getInstance, ...rest }) {
    const artRef = useRef();

    useEffect(() => {
        const art = new Artplayer({
            ...option,
            container: artRef.current,
            isLive: false,
            setting: true,
            fullscreen: true,
            screenshot: true,
            fastForward: true,
            playbackRate: true,
            miniProgressBar: true,
            autoOrientation: true,
            whitelist: ['*'],
            moreVideoAttr: {
                crossOrigin: 'anonymous',
                'x5-video-player-type': 'h5',
                'x5-video-player-fullscreen': false,
                'x5-video-orientation': 'portraint',
                preload: "auto"
            },
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
            },
        });

        art.on('ready', () => {
            console.log('artplayer is ready!');
            // art.play();
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