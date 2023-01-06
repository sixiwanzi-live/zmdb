import * as React from 'react';
import { 
    Avatar,
    Image,
    Tag
} from 'antd-mobile';
import { FixedSizeList } from 'react-window';
import { context as globalContext } from './context';

export const ClipBody = () => {

    const { clips, selectedOrganization, selectedAuthors, setSelectedClip, scrollOffsetRef } = React.useContext(globalContext);

    const listRef = React.useRef();

    const filteredClips = React.useMemo(() => {
        return clips.filter(clip => selectedAuthors.map(author => author.id).includes(clip.author.id));
    }, [clips, selectedAuthors]);

    const rowRender = ({index, style}) => {
        return (
            <div key={filteredClips[index].id} style={{ ...style }}>
                <div style={{ display:'flex', paddingTop:'20px' }}>
                    <div style={{ flex:1, paddingRight:'10px' }}>
                        <Avatar src={`//${filteredClips[index].author.avatar}@120w_120h.webp`} style={{ "--border-radius":"44px" }} />
                    </div>
                    <div style={{ flex:8, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                        <div style={{ flex:1, fontWeight:'bold', color:'#f78fb3', fontSize:'14px' }}>
                            {filteredClips[index].author.name}
                        </div>
                        <div style={{ flex:1, fontSize:'12px', color:'#747d8c'}}>
                            <p>
                                {filteredClips[index].datetime} 
                                {
                                    filteredClips[index].type === 1 ? 
                                        <Tag color='#2db7f5' fill='solid' style={{ marginLeft: '5px' }}>
                                            B站
                                        </Tag>
                                    : filteredClips[index].type === 2 ?
                                        <Tag color='#87d068' fill='solid' style={{ marginLeft: '5px' }}>
                                            录播站
                                        </Tag>
                                    : filteredClips[index].type === 3 ?
                                        <Tag color='#ccccff' fill='solid' style={{ marginLeft: '5px' }}>
                                            本地源
                                        </Tag>
                                    : filteredClips[index].type === 4 ?
                                        <Tag color='#FF6666' fill='solid' style={{ marginLeft: '5px' }}>
                                            直播中
                                        </Tag>
                                    :
                                        <Tag color='#cccccc' fill='solid' style={{ marginLeft: '5px' }}>
                                            待解析
                                        </Tag>
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    {
                        filteredClips[index].cover.length > 0 ? 
                            <Image
                                style={{  borderRadius: 4, height:'220px' }}
                                src={`//${filteredClips[index].cover}`} 
                                onClick={() => {setSelectedClip(filteredClips[index]);}}
                            />
                        :
                            <Image
                                style={{  borderRadius: 4, height:'220px' }}
                                src={`no-cover.jpg`} 
                                onClick={() => {setSelectedClip(filteredClips[index]);}}
                            />
                    }
                    <div style={{ fontWeight:'bold', fontSize:'16px', paddingTop:'13px', paddingBottom:'15px' }}>
                        {filteredClips[index].title}
                    </div>
                </div>
                <div style={{ height:'5px', backgroundColor:'#F9F9F9' }}></div>
            </div>
        )
    };

    return (
        <div id="my-clip-list" style={{ position:'relative', paddingLeft:'5px', paddingRight:'5px' }}>
            <FixedSizeList 
                ref={listRef}
                height={filteredClips.length <= 10 ? filteredClips.length * 350 : 3500}
                itemData={filteredClips}
                itemCount={filteredClips.length}
                itemSize={350}
                width={'100%'}
                initialScrollOffset={scrollOffsetRef.current}
                onScroll={({scrollDirection, scrollOffset, scrollUpdateWasRequested}) => {
                    scrollOffsetRef.current = scrollOffset;
                }}
            >
                {rowRender}
            </FixedSizeList>            
        </div>
    );
}