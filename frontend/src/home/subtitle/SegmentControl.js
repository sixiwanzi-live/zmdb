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
            const a = document.createElement('a');
            a.style.display = 'none';
            a.target = '_blank';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (ex) {
            console.log(ex);
            onMessage({
                type: 'error',
                content: `code:${ex.response.data.code},message:${ex.response.data.message}`
            });
        }
        setSegmentDisabled(false);
    }

    return (
        <Box sx={{display:'flex', pt:'2rem'}}>
            <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                <TextField disabled size="small" label="起始时间" value={toTime(startTime)}/>
            </Box>
            <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                <TextField disabled size="small" label="终止时间" value={toTime(endTime)}/>
            </Box>
            <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                <Button sx={{width:'100%', height:'100%'}} variant="contained" disabled={segmentDisabled} onClick={onClick}>生成切片</Button>
            </Box>
        </Box>
    );
}