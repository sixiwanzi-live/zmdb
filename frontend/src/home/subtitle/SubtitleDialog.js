import * as React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import Button from '@mui/material/Button'
import { SubtitleButtonGroup } from './SubtitleButtonGroup';
import { SubtitleTable } from './SubtitleTable';
import { context } from '../context';
import config from '../../config';


export const SubtitleDialog = ({clip, subtitles, status, setStatus}) => {

    const { pinyinChecked } = React.useContext(context);
    const [match, setMatch] = React.useState(-1);
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    
    const onClose = () => {
        setMatch(-1);
        setStatus(false);
        setSelectedTab(0);
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
        <Dialog fullscreen='true' fullWidth={true} maxWidth='lg' open={status} onClose={onClose}>
            <DialogContent sx={{ display:'flex', height:'50rem', mt:'16px' }}>
                <Box sx={{display:'flex', flex:60}}>
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
                                    <SubtitleTable match={match} clip={clip} subtitles={subtitles} setCurrentTime={setCurrentTime} /> 
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
                                    /> 
                                </Box>
                            }
                        </div>
                    </Box>
                </Box>
                <Box sx={{flex:40, ml:'1rem'}}>
                    <DialogTitle>
                        {clip.title}
                    </DialogTitle>
                    {/* <video 
                        id='my-video' 
                        width="400" 
                        height="225" 
                        autoplay="true" 
                        controls="true"
                        poster={`${config.url.file}/clips/${clip.author.organizationId}/${clip.author.id}/${clip.id}@400x225.webp`}>
                        <source src={clip.url} type="video/mp4" />
                    </video> */}
                    <iframe width="480" height="360" src={`//player.bilibili.com/player.html?aid=813402376&bvid=BV1B34y1H7YT&cid=774525708&page=1&autoplay=true&t=${currentTime}`} scrolling="no" border="0" frameBorder="no" framespacing="0" allowFullScreen={true}> 
                        
                    </iframe>
                </Box>       
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}