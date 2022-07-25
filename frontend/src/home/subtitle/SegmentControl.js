import * as React from 'react';
import { Box, Button, TextField } from '@mui/material';
import config from '../../config';
import { context as globalContext } from '../../context';
import { context } from '../context';
import { toTime } from '../../utils';
import ClipApi from '../../api/ClipApi';


export const SegmentControl = ({clip, startTime, endTime}) => {

    const { onMessage } = React.useContext(globalContext);
    const { segmentDisabled, setSegmentDisabled } = React.useContext(context);


    const onClick = async (e) => {
        if (startTime >= endTime) {
            onMessage({
                type: 'error',
                content: '起始时间必须小于终止时间！'
            });
            return;
        }
        try {
            setSegmentDisabled(true);
            onMessage({
                type:'success',
                content: `切片处理中:${clip.title} ${toTime(startTime)} -> ${toTime(endTime)}`
            });
            const res1 = await ClipApi.fetchSegment(clip.id, startTime, endTime);
            const filename = res1.data.filename;
            const url = `${config.url.segment}/${filename}`;
            await new Promise((res, rej) => {
                setTimeout(async () => {
                    try {
                        onMessage({
                            type:'success',
                            content: `切片已生成，下载中:${clip.title} ${toTime(startTime)} -> ${toTime(endTime)}`
                        });
                        const res2 = await fetch(url);
                        const blob = await res2.blob();
                        const a = document.createElement("a");
                        const downloadUrl = window.URL.createObjectURL(blob);
                        a.download = filename;
                        a.href = downloadUrl;
                        a.click();
                        window.URL.revokeObjectURL(downloadUrl);
                        a.remove();
                        res();
                    } catch (ex) {
                        rej(ex);
                    }
                }, 3000);
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.data) {
                onMessage({
                    type: 'error',
                    content: `${ex.response.data.code}:${ex.response.data.message}`
                });
            } else {
                onMessage({
                    type: 'error',
                    content: '内部错误'
                });
            }
        } finally {
            setSegmentDisabled(false);
        }
        
    }

    return (
        <React.Fragment>
            <Box sx={{display:'flex'}}>
                <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                    <TextField disabled variant="standard" size="small" label="起始时间" value={toTime(startTime)}/>
                </Box>
                <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                    <TextField disabled variant="standard" size="small" label="终止时间" value={toTime(endTime)}/>
                </Box>
                <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                    <Button sx={{width:'100%', height:'100%'}} size="small" variant="contained" disabled={segmentDisabled} onClick={onClick}>生成切片</Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}