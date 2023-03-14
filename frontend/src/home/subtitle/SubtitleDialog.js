import * as React from 'react';
import { Box, Dialog, Button, DialogTitle, DialogContent, DialogActions, Tabs, Tab, TextField } from '@mui/material';
import ArtPlayer from './ArtPlayer';
import { SubtitleButtonGroup } from './SubtitleButtonGroup';
import { SubtitleTable } from './SubtitleTable';
import { SegmentControl } from './SegmentControl';
import config from '../../config';
import { toTime  } from '../../utils';

export const SubtitleDialog = ({clip, subtitles, status, setStatus}) => {

    const [match, setMatch]             = React.useState(-1);
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [startTime, setStartTime]     = React.useState('00:00:00,000');
    const [endTime, setEndTime]         = React.useState('00:00:00,000');
    const [segmentName, setSegmentName] = React.useState('');

    const playerRef = React.useRef();

    const onClose = () => {
        setMatch(-1);
        setStatus(false);
        setSelectedTab(0);
        setStartTime('00:00:00,000');
        setEndTime('00:00:00,000');
        setSegmentName('');
    }

    const onChange = (e, newValue) => {
        setSelectedTab(newValue);
    }

    const onSeek = (currentTime) => {
        if (clip.type === 1) {
            setCurrentTime(currentTime);
        } else {
            playerRef.current.currentTime = currentTime;
        }
    }

    React.useEffect(() => {
        subtitles.forEach(subtitle => {
            if (subtitle.matchMode === 1) {
                subtitle.markedContent = subtitle.markedContent
                                        .replaceAll('{', '<mark style="background-color: #C4F2CE">')
                                        .replaceAll('}', '</mark>')
                                        .replaceAll('[', '<mark>')
                                        .replaceAll(']', '</mark>');
            } else if (subtitle.matchMode === 2) {
                subtitle.markedContent = `<mark style="background-color: #FFE9F4">${subtitle.markedContent}</mark>`;
            }
        });
        for (let i = 0; i < subtitles.length; ++i) {
            if (subtitles[i].matchMode) {
                setMatch(i);
                break;
            }
        }
    }, [subtitles]);

    return (
        <Dialog fullscreen='true' fullWidth={true} maxWidth='xl' open={status} onClose={onClose}>
            <DialogContent sx={{ display:'flex', height:'50rem', mt:'1px' }}>
                <Box sx={{display:'flex', flex:65}}>
                    <Box sx={{ flex:1 }}>
                        <Tabs
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                            orientation="vertical"
                            value={selectedTab}
                            onChange={onChange}
                        >
                            <Tab label="全部" />
                            <Tab label="匹配" />
                        </Tabs>
                    </Box>
                    
                    <Box sx={{ flex:10, ml:'2rem' }}>
                        <div role='tabpanel' hidden={0 !== selectedTab}>
                            { 
                                selectedTab === 0 &&
                                <Box>
                                    {match >= 0 && <SubtitleButtonGroup subtitles={subtitles} match={match} setMatch={setMatch} />}
                                    <SubtitleTable 
                                        match={match} 
                                        subtitles={subtitles} 
                                        onSeek={onSeek}
                                        setStartTime={setStartTime}
                                        setEndTime={setEndTime}
                                    /> 
                                </Box>
                            }
                        </div>
                        <div role='tabpanel' hidden={1 !== selectedTab}>
                            { 
                                selectedTab === 1 &&
                                <Box>
                                    <SubtitleTable 
                                        match={-1} 
                                        subtitles={subtitles.filter(subtitle => subtitle.matchMode === 1 || subtitle.matchMode === 2)} 
                                        onSeek={onSeek} 
                                        setStartTime={setStartTime}
                                        setEndTime={setEndTime}
                                    /> 
                                </Box>
                            }
                        </div>
                    </Box>
                </Box>
                <Box sx={{flex:35, ml:'1rem'}}>
                    <DialogTitle>
                        {clip.title}
                    </DialogTitle>
                    {
                        clip.type === 1 ?
                        <iframe title={clip.title} width="100%" height="360" src={`//${clip.playUrl}&autoplay=true&t=${currentTime}`} scrolling="no" border="0" frameBorder="no" framespacing="0" allowFullScreen={true}></iframe> :
                        <ArtPlayer
                            option={{
                                url: `https://${clip.playUrl}`,
                                poster: `https://${clip.cover}`,
                                subtitle: {
                                    url: `${config.url.api}/clips/${clip.id}/srt`,
                                    type: 'srt',
                                    encoding: 'utf-8',
                                    style: {
                                        color: '#00DFFC',
                                        'font-size': '20px',
                                    },
                                },
                            }}
                            style={{
                                width: '100%',
                                height: '360px'
                            }}
                            getInstance={(art) => playerRef.current = art}
                        />
                    }
                    <Box sx={{ width: '100%', mt:'1rem' }}>
                        <Button
                            sx={{ mr:'1rem' }}
                            variant="contained" 
                            onClick={(e) => {setStartTime(toTime(Math.floor(playerRef.current.currentTime * 1000)))}}
                        >
                            设置起始时间
                        </Button>
                        <Button 
                            sx={{ mr:'1rem' }}
                            variant="contained" 
                            onClick={(e) => {setEndTime(toTime(Math.floor(playerRef.current.currentTime * 1000)))}}
                        >
                            设置结束时间
                        </Button>
                        <TextField variant="standard" size="small" label="切片名" value={segmentName} onChange={(e) => {setSegmentName(e.target.value)}} />
                    </Box>
                    <SegmentControl clip={clip} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} segmentName={segmentName} />
                </Box>       
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}