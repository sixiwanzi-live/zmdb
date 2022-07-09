import * as React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import Button from '@mui/material/Button'
import { SubtitleButtonGroup } from './SubtitleButtonGroup';
import { SubtitleTable } from './SubtitleTable';
import { context } from '../context';

export const SubtitleDialog = ({clip, subtitles, status, setStatus}) => {

    const { pinyinChecked } = React.useContext(context);
    const [match, setMatch] = React.useState(-1);
    const [selectedTab, setSelectedTab] = React.useState(0);
    
    const onClose = () => {
        setMatch(-1);
        setStatus(false);
        setSelectedTab(0);
    }

    const onChange = (e, newValue) => {
        setSelectedTab(newValue);
    }

    const setCurrentTime = (currentTime) => {
        const video = document.getElementById('my-video');
        video.currentTime = currentTime;
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
            <DialogTitle>
                {clip.title}
            </DialogTitle>
            <DialogContent sx={{ display:'flex', height:'50rem' }}>
                <Box sx={{display:'flex', flex:2}}>
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
                                        subtitles={subtitles.filter(subtitle => pinyinChecked ? subtitle.matchMode === 1 || subtitle.matchMode === 2 : subtitle.matchMode === 1)} /> 
                                </Box>
                            }
                        </div>
                    </Box>
                </Box>
                {/* <Box sx={{flex:1}}>
                    <video id='my-video' width="320" height="240" controls>
                        <source src="https://upos-sz-mirrorali02.bilivideo.com/upgcxcode/71/68/720376871/720376871-1-16.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1656785643&gen=playurlv2&os=ali02bv&oi=0&trid=5e84aa4281414baf8dfda82fa5a4a348h&mid=95111328&platform=html5&upsig=c6b3c1f9928fcc387cfe29a4347bfbe1&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&bw=52872&logo=80000000" type="video/mp4" />
                    </video>
                </Box>        */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}