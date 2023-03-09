import * as React from 'react';
import { 
    Button,
    Tabs,
    SwipeAction,
    List,
    Popup,
    Form,
    Input,
    Switch,
    Toast
} from 'antd-mobile';
import { 
    DownCircleOutline,
    UpCircleOutline,
    MovieOutline
} from 'antd-mobile-icons';
import { FixedSizeList } from 'react-window';
import ArtPlayer from './ArtPlayer';
import { context as globalContext } from './context';
import ClipApi from './api/ClipApi';
import SubtitleApi from './api/SubtitleApi';
import config from './config';
import { fromMicroseconds } from './utils';

export const SubtitleBody = () => {

    const { selectedClip, searchText }       = React.useContext(globalContext);
    const [subtitles, setSubtitles]                 = React.useState([]);
    const [matchedSubtitles, setMatchedSubtitles]   = React.useState([]);
    const [match, setMatch]                         = React.useState(-1);
    const [currentTime, setCurrentTime]             = React.useState(0);
    const [activeTab, setActiveTab]                 = React.useState('');
    const [segmentVisible, setSegmentVisible]       = React.useState(false);
    const [downloading, setDownloading]             = React.useState(false);
    
    const [segmentForm] = Form.useForm();

    const playerRef = React.useRef();
    const listRef = React.useRef();

    React.useEffect(() => {
        if (match >= 0 && activeTab === 'total') {
            listRef.current.scrollToItem(match, "center");
        }
    }, [activeTab, match]);

    React.useEffect(() => {
        (async () => {
            if (selectedClip) {
                try {
                    const json = await SubtitleApi.findByClipId(selectedClip.id, searchText || '');
                    json.forEach(item => {
                        if (item.matchMode === 1) {
                            item.markedContent = item.markedContent
                                                    .replaceAll('{', '<mark style="background-color: #C4F2CE">')
                                                    .replaceAll('}', '</mark>')
                                                    .replaceAll('[', '<mark>')
                                                    .replaceAll(']', '</mark>');
                        } else if (item.matchMode === 2) {
                            item.markedContent = `<mark style="background-color: #FFE9F4">${item.markedContent}</mark>`;
                        }
                    });
                    for (let i = 0; i < json.length; ++i) {
                        if (json[i].matchMode) {
                            setMatch(i);
                            break;
                        }
                    }
                    setSubtitles(json);
                    setMatchedSubtitles(json.filter(item => item.matchMode === 1 || item.matchMode === 2));
                } catch (ex) {
                    console.log(ex);
                    if (ex) {
                        Toast.show({
                            icon: 'fail',
                            content: `${ex.code}:${ex.message}`
                        });
                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: '内部错误'
                        });
                    }
                }
            }
            if (searchText) {
                setActiveTab('matched');
            } else {
                setActiveTab('total');
            }
        })();
    }, [selectedClip, searchText]);

    const onMatchDown = (e) => {
        if (activeTab === 'total') {
            for (let i = match + 1; i < subtitles.length; ++i) {
                if (subtitles[i].matchMode !== 1 && subtitles[i].matchMode !== 2) {
                    continue;
                }
                setMatch(i);
                break;
            }
        }
    }

    const onMatchUp = (e) => {
        if (activeTab === 'total') {
            for (let i = match - 1; i >= 0; --i) {
                if (subtitles[i].matchMode !== 1 && subtitles[i].matchMode !== 2) {
                    continue;
                }
                setMatch(i);
                break;
            }
        }
    }

    const onSeek = (time) => {
        if (selectedClip.type === 1) {
            setCurrentTime(time);
        } else {
            if (!playerRef.current.playing) {
                playerRef.current.play();
            }
            playerRef.current.currentTime = time;
        }
    }

    const onSegment = async (values) => {
        setSegmentVisible(false);
        setDownloading(true);
        const startTime = `${values.startTime}`;
        const endTime = `${values.endTime}`;
        const audio = values.audio;
        if (startTime >= endTime) {
            Toast.show({
                icon: 'fail',
                content: '起始时间必须早于结束时间'
            });
            setDownloading(false);
            return;
        }
        Toast.show({
            duration: 1000,
            content: '切片处理中'
        });
        try {
            const json = await ClipApi.fetchSegment(selectedClip.id, startTime, endTime, audio);
            const filename = json.filename;
            let url = '';
            if (selectedClip.type === 3 || selectedClip.type === 4 || selectedClip.type === 5) {
                url = `${config.static.url}/segments/${filename}`;
            } else {
                url = `${config.url.segment}/${filename}`;
            }
            
            setTimeout(async () => {
                const a = document.createElement("a");
                a.download = filename;
                a.href = url;
                a.click();
                a.remove();
            }, 1000);
        } catch (ex) {
            console.log(ex);
            if (ex) {
                Toast.show({
                    icon: 'fail',
                    content: `${ex.code}:${ex.message}`
                });
            } else {
                Toast.show({
                    icon: 'fail',
                    content: '内部错误'
                });
            }
        }
        setDownloading(false);
    }

    const rowRender = ({index, style, data}) => {
        return (
            <div style={style}>
                <SwipeAction
                    key={data.subtitles[index].lineId}
                    rightActions={
                        [
                            {
                                key: 'setStart',
                                text: '起始',
                                color: '#30AADD',
                                onClick: e => { 
                                    segmentForm.setFieldValue('startTime', fromMicroseconds(data.subtitles[index].start)); 
                                    segmentForm.validateFields(['startTime']);
                                }
                            },
                            {
                                key: 'setEnd',
                                text: '结束',
                                color: '#F96666',
                                onClick: e => { 
                                    segmentForm.setFieldValue('endTime', fromMicroseconds(data.subtitles[index].end));
                                    segmentForm.validateFields(['endTime']);
                                }
                            }
                        ]
                    }
                >
                    <List.Item 
                        key={data.subtitles[index].lineId}
                        arrow={false}
                        onClick={(e) => { onSeek(Math.floor(data.subtitles[index].start / 1000)); }}
                    >
                        <div style={{ display:'flex', fontSize:'14px' }}>
                            <div style={{ flex:1 }}>{ data.subtitles[index].lineId }</div>
                            <div style={{ flex:2.5 }}>{ fromMicroseconds(data.subtitles[index].start) }</div>
                            <div style={{ flex:6 }} dangerouslySetInnerHTML={{__html:data.subtitles[index].markedContent}}></div>
                        </div>  
                    </List.Item>
                </SwipeAction>
            </div>
        )
    }

    return (
        <div style={{ position:'relative', width: '100%', height:'100%', display:'flex', flexDirection:'column' }}>
            {
                selectedClip.type === 1 ? 
                    <iframe title={selectedClip.title} width="100%" height="240px" src={`//${selectedClip.playUrl}&autoplay=true&t=${currentTime}`} scrolling="no" border="0" frameBorder="no" framespacing="0" allowFullScreen={true}></iframe>
                :
                    <ArtPlayer
                        option={{
                            url: `https://${selectedClip.playUrl}`,
                            poster: `https://${selectedClip.cover}`,
                            subtitle: {
                                url: `${config.url.api}/clips/${selectedClip.id}/srt`,
                                type: 'srt',
                                encoding: 'utf-8',
                                style: {
                                    color: '#00DFFC',
                                    'font-size': '1rem',
                                },
                            },
                        }}
                        style={{
                            width: '100%',
                            height: '240px',
                            minHeight: '240px',
                            zIndex:10, 
                            backgroundColor:'white'
                        }}
                        getInstance={(art) => playerRef.current = art}
                    />
            }
            <div style={{ flex:" 0 0 auto", width:"100%", height:"39px", display:'flex', justifyContent:'space-between' }}>
                <Tabs 
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ "--title-font-size":'16px', }}
                >
                    <Tabs.Tab title='全部' key='total' />
                    <Tabs.Tab title='匹配' key='matched' />
                </Tabs>
                <div style={{ display:'flex' }}>
                    <Button 
                        size='middle' 
                        style={{ '--border-style':'none'}}
                        onClick={onMatchUp}
                    >
                        <UpCircleOutline fontSize={24} />
                    </Button>
                    <div style={{ margin:'0px 5px'}}></div>
                    <Button 
                        size='middle' 
                        style={{ '--border-style':'none'}}
                        onClick={onMatchDown}
                    >
                        <DownCircleOutline fontSize={24}/>
                    </Button>
                    <div style={{ margin:'0px 5px'}}></div>
                    <Button 
                        size='middle' 
                        style={{ '--border-style':'none'}}
                        onClick={(e) => {setSegmentVisible(true);}}
                    >
                        <MovieOutline fontSize={24}/>
                    </Button>
                </div>
                <Popup
                    visible={segmentVisible}
                    onMaskClick={() => { setSegmentVisible(false) }}
                    bodyStyle={{ height: '40vh' }}
                >
                    <Form
                        form={segmentForm}
                        onFinish={onSegment}
                        layout='horizontal'
                        footer={
                            <Button block type='submit' color='primary' size='large' loading={downloading}>
                                提交
                            </Button>
                        }
                    >
                        <Form.Header>生成切片</Form.Header>
                        <Form.Item
                            name='startTime'
                            label='起始时间'
                            rules={[{ required: true, message: '起始时间不能为空' }]}
                        >
                            <Input placeholder='请输入起始时间' />
                        </Form.Item>
                        <Form.Item
                            name='endTime'
                            label='结束时间'
                            rules={[{ required: true, message: '结束时间不能为空' }]}
                        >
                            <Input placeholder='请输入结束时间' />
                        </Form.Item>
                        <Form.Item
                            name='audio'
                            label='仅音频'
                            childElementPosition='right'
                        >
                            <Switch />
                        </Form.Item>
                        {/* <Form.Item
                            name='filename'
                            label='切片文件名'
                        >
                            <Input placeholder='(可选)请输入自定义切片文件名' />
                        </Form.Item> */}
                    </Form>
                </Popup>
            </div>
            <div id="my-list" style={{ flex:'1 1 auto', position:"relative", width:'100%', overflowY:'auto' }}>
                <List>
                    {
                        activeTab === 'total' ?
                            <FixedSizeList
                                ref={listRef} 
                                height={document.getElementById("my-list").offsetHeight}
                                itemData={{
                                    subtitles:subtitles
                                }}
                                itemCount={subtitles.length}
                                itemSize={45}
                                width={'100%'}
                            >
                                {rowRender}
                            </FixedSizeList >
                        :
                            <FixedSizeList 
                                height={45 * matchedSubtitles.length}
                                itemData={{
                                    subtitles:matchedSubtitles
                                }}
                                itemCount={matchedSubtitles.length}
                                itemSize={45}
                                width={'100%'}
                            >
                                {rowRender}
                            </FixedSizeList >
                    }
                </List>
            </div>
        </div>
    );
}