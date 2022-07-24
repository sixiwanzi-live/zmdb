import * as React from 'react';
import { Box, Dialog, Button, DialogTitle, DialogContent, DialogActions, Tabs, Tab, TextField } from '@mui/material';
import { SubtitleButtonGroup } from './SubtitleButtonGroup';
import { SubtitleTable } from './SubtitleTable';
import { SegmentControl } from './SegmentControl';
import { context } from '../context';


export const SubtitleDialog = ({clip, subtitles, status, setStatus}) => {

    const { pinyinChecked }             = React.useContext(context);
    const [match, setMatch]             = React.useState(-1);
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [startTime, setStartTime]     = React.useState(0);
    const [endTime, setEndTime]         = React.useState(0);
    
    const onClose = () => {
        setMatch(-1);
        setStatus(false);
        setSelectedTab(0);
        setStartTime(0);
        setEndTime(0);
    }

    const onChange = (e, newValue) => {
        setSelectedTab(newValue);
    }

    React.useEffect(() => {
        subtitles.forEach(subtitle => {
            subtitle.markedContent = subtitle.markedContent
                                        .replaceAll('{', '<mark style="background-color: #C4F2CE">')
                                        .replaceAll('}', '</mark>')
                                        .replaceAll('[', '<mark>')
                                        .replaceAll(']', '</mark>');
            
        });
        for (let i = 0; i < subtitles.length; ++i) {
            if (pinyinChecked) {
                if (subtitles[i].matchMode === 1 || subtitles[i].matchMode === 2) {
                    setMatch(i);
                    break;
                }
            } else {
                if (subtitles[i].matchMode === 1) {
                    setMatch(i);
                    break;
                }
            }
        }
    }, [pinyinChecked, subtitles]);

    return (
        <Dialog fullscreen='true' fullWidth={true} maxWidth='xl' open={status} onClose={onClose}>
            <DialogTitle>
                {clip.title}
            </DialogTitle>
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
                                        clip={clip} 
                                        subtitles={subtitles} 
                                        setCurrentTime={setCurrentTime}
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
                                        clip={clip} 
                                        subtitles={subtitles.filter(subtitle => pinyinChecked ? subtitle.matchMode === 1 || subtitle.matchMode === 2 : subtitle.matchMode === 1)} 
                                        setCurrentTime={setCurrentTime} 
                                        setStartTime={setStartTime}
                                        setEndTime={setEndTime}
                                    /> 
                                </Box>
                            }
                        </div>
                    </Box>
                </Box>
                <Box sx={{flex:35, ml:'1rem'}}>
                    <iframe title={clip.title} width="100%" height="360" src={`//player.bilibili.com/player.html?bvid=${clip.bv}&autoplay=true&t=${currentTime}`} scrolling="no" border="0" frameBorder="no" framespacing="0" allowfullscreen="true"> 
                    </iframe>
                    <SegmentControl clip={clip} startTime={startTime} endTime={endTime}/>
                </Box>       
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}