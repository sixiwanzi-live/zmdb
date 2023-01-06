import * as React from 'react';
import { Box, Button, Divider, IconButton, Tooltip } from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { VariableSizeList  } from 'react-window';
import { toTime } from '../../utils';

export const SubtitleTable = ({match, subtitles, onSeek, setStartTime, setEndTime}) => {

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
                    <Box sx={{ flex:1 , display:'flex'}}>
                        <Tooltip title="设置切片起始时间">
                            <IconButton 
                                sx={{pr:'0.5rem'}}
                                color="primary" 
                                aria-label="set start time" 
                                size="small"
                                onClick={(e) => setStartTime(toTime(data.subtitles[index].start))}
                            >
                                <PlayCircleFilledWhiteIcon fontSize='inherit'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="设置切片终止时间">
                            <IconButton 
                                sx={{pl:'0.5rem'}}
                                color="primary" 
                                aria-label="set end time" 
                                size="small"
                                onClick={(e) => setEndTime(toTime(data.subtitles[index].end))}
                            >
                                <StopCircleIcon fontSize='inherit'/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display:'flex', flex:2, alignContent:'center' }}>
                        <Button sx={{p:0, lineHeight:1.5, fontSize:'1rem', width:'100%'}} 
                            onClick={() => {onSeek(data.subtitles[index].start / 1000)}}
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
                <Box sx={{ flex:1, textAlign:'center' }}>操作</Box>
                <Box sx={{ flex:2, textAlign:'center' }}>时间</Box>
                <Box sx={{ flex:9, textAlign: 'left'}}>字幕</Box>
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
                    subtitles:subtitles
                }}
            >
                {Row}
            </VariableSizeList >
        </Box>
    )
}