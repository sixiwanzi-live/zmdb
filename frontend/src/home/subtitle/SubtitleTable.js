import * as React from 'react';
import { Box, Button, Divider, Link } from '@mui/material';
import { FixedSizeList } from 'react-window';
import config from '../../config';
import { toTime } from '../../utils';

export const SubtitleTable = ({match, clip, subtitles, setCurrentTime}) => {

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
                <Box sx={{ display:'flex', backgroundColor:{backgroundColor} }}>
                    <Box sx={{ flex:1 }}>{data.subtitles[index].lineId}</Box>
                    <Box sx={{ flex:3 }}>
                        <Button sx={{p:0, verticalAlign:'top', lineHeight:1.5, fontSize:'1rem', justifyContent:'left'}} 
                                onClick={() => {setCurrentTime(data.subtitles[index].start / 1000)}}>
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
                <Box sx={{ flex:1 }}>序号</Box>
                <Box sx={{ flex:3 }}>时间</Box>
                <Box sx={{ flex:9 }}>字幕</Box>
            </Box>
            <Box sx={{ mt:'1rem', mb:'1rem'}}>
                <Divider />
            </Box>
            <FixedSizeList
                ref={listRef}
                height={420}
                itemCount={subtitles.length}
                itemSize={30}
                width={'100%'}
                itemData={{
                    clip: clip, 
                    subtitles:subtitles
                }}
            >
                {Row}
            </FixedSizeList>
        </Box>
    )
}