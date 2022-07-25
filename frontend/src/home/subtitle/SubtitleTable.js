import * as React from 'react';
import { Box, Button, Divider, IconButton, Tooltip } from '@mui/material';
import ForwardIcon from '@mui/icons-material/Forward';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { VariableSizeList  } from 'react-window';
import config from '../../config';
import { toTime } from '../../utils';

export const SubtitleTable = ({match, clip, subtitles, setCurrentTime, setStartTime, setEndTime}) => {

    const listRef = React.useRef();

    React.useEffect(() => {
        if (match >= 0) {
            listRef.current.scrollToItem(match);
        }
    }, [match]);

    const Row = ({index, style, data}) => {
        const backgroundColor = match === data.subtitles[index].lineId - 1 ? '#F5F5F5' : '#FFFFFF';
        return (
            <div style={style}>
                <Box sx={{ display:'flex', flexFlow:'wrap', backgroundColor:{backgroundColor} }}>
                    <Box sx={{ flex:1, textAlign:'center' }}>
                        {data.subtitles[index].lineId}
                    </Box>
                    <Box sx={{ flex:1.2 , display:'flex', justifyContent:'space-between'}}>
                        <Tooltip title="设置切片起始时间">
                            <IconButton 
                                sx={{p:0}}
                                color="primary" 
                                aria-label="set start time" 
                                size="small"
                                onClick={(e) => setStartTime(data.subtitles[index].start)}
                            >
                                <PlayCircleFilledWhiteIcon fontSize='inherit'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="设置切片终止时间">
                            <IconButton 
                                sx={{p:0}}
                                color="primary" 
                                aria-label="set end time" 
                                size="small"
                                onClick={(e) => setEndTime(data.subtitles[index].end)}
                            >
                                <StopCircleIcon fontSize='inherit'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="跳转到B站">
                            <IconButton 
                                sx={{p:0}}
                                color="primary" 
                                aria-label="redirect to bilibili" 
                                component="a"
                                target='_blank' 
                                underline="hover" 
                                rel ="noreferrer" 
                                size="small"
                                href={`${config.url.clip}/${data.clip.bv}?t=${data.subtitles[index].start / 1000}`}
                            >
                                <ForwardIcon fontSize='inherit'/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display:'flex', flex:2, alignContent:'center' }}>
                        <Button sx={{p:0, lineHeight:1.5, fontSize:'1rem', width:'100%'}} 
                            onClick={() => {setCurrentTime(data.subtitles[index].start / 1000)}}
                        >
                            {toTime(data.subtitles[index].start)}
                        </Button>
                    </Box>
                    <Box sx={{ flex:9 }} dangerouslySetInnerHTML={{__html:data.subtitles[index].markedContent}} />
                </Box>
            </div>
        )
    }

    return (
        <Box sx={{ width:'100%'}}>
            <Box sx={{ display:'flex' }}>
                <Box sx={{ flex:1, textAlign:'center' }}>序号</Box>
                <Box sx={{ flex:1.2, textAlign:'center' }}>操作</Box>
                <Box sx={{ flex:2, textAlign:'center' }}>时间</Box>
                <Box sx={{ flex:9 }}>字幕</Box>
            </Box>
            <Box sx={{ mt:'1rem', mb:'1rem'}}>
                <Divider />
            </Box>
            <VariableSizeList 
                ref={listRef}
                height={420}
                itemCount={subtitles.length}
                itemSize={index => 30 + 20 * Math.floor(subtitles[index].len / 30)}
                width={'100%'}
                itemData={{
                    clip: clip, 
                    subtitles:subtitles
                }}
            >
                {Row}
            </VariableSizeList >
        </Box>
    )
}