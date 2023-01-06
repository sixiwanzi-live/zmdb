import * as React from 'react';
import { 
    Mask,
    SpinLoading,
    Toast
} from 'antd-mobile';
import { context as globalContext } from './context';
import { Header } from './Header';
import { Footer } from './Footer';
import OrganizationApi from './api/OrganizationApi';
import AuthorApi from './api/AuthorApi';
import ClipApi from './api/ClipApi';
import { ClipBody } from './ClipBody';
import { SubtitleBody } from './SubtitleBody';

export const App = () => {

    const [organizations, setOrganizations] = React.useState([]);
    const [selectedOrganization, setSelectedOrganization] = React.useState(null);
    const [authors, setAuthors] = React.useState([]);
    const [selectedAuthors,setSelectedAuthors] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const [clips, setClips] = React.useState([]);
    const [selectedClip, setSelectedClip] = React.useState(null);
    const [maskVisible, setMaskVisible] = React.useState(false);

    const scrollOffsetRef = React.useRef(0);

    React.useEffect(() => {
        (async () => {
            // 获取所有organizations
            try {
                const json = await OrganizationApi.findAll();
                setOrganizations(json || []);
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
        })();
    }, []);

    React.useEffect(() => {
        // 自定义回退
        window.history.pushState(null, null, '');
        window.addEventListener('popstate', e => {
            setSelectedClip(null);
            e.preventDefault();
        }, {
            passive: false
        });
    }, []);

    const onSelectOrganization = async (organization) => {
        setSelectedOrganization(organization);
        scrollOffsetRef.current = 0;
        try {
            const json1 = await AuthorApi.findByOrganizationId(organization.id);
            setAuthors(json1 || []);
            setSelectedAuthors(json1 || []);
            const json2 = await ClipApi.findByOrganizationId(organization.id);
            setClips(json2 || []);
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
        setSearchText(null);
    }

    const onSearch = async (keyword) => {
        if (keyword.length === 0) {
            return;
        }
        
        if (!selectedOrganization) {
            return;
        }
        setMaskVisible(true);
        try {
            const json = await ClipApi.findByOrganizationId(selectedOrganization.id, keyword);
            setClips(json || []);
            setSearchText(keyword || []);
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
        setMaskVisible(false);
        // scrollOffsetRef.current = 0;
    }

    const value = {
        organizations,
        selectedOrganization,
        onSelectOrganization,
        authors,
        selectedAuthors,
        setSelectedAuthors,
        searchText,
        setSearchText,
        onSearch,
        clips,
        selectedClip,
        setSelectedClip,
        setMaskVisible,
        scrollOffsetRef
    };

    return (
        <globalContext.Provider value={value}>
            <React.Fragment>
                <div style={{ flex:"0 0 auto", backgroundColor:'white', zIndex:10 }}>
                    <Header />
                </div>
                <div style={{ flex:'1 1 auto', position:'relative', overflowY:'auto' }}>
                    {
                        selectedClip ? <SubtitleBody /> : <ClipBody />
                    }
                </div>
                {
                    !selectedClip ? 
                        <div style={{ flex:'0 0 auto' }}>
                            <Footer />
                        </div>
                    : 
                        <div></div>
                }
                <Mask 
                    color='white'
                    visible={maskVisible} 
                    onMaskClick={() => setMaskVisible(false)} 
                >
                    <SpinLoading 
                        style={{ 
                            '--size': '60px',
                            position:  'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-30px',
                            marginLeft: '-30px'
                        }} 
                        color='primary'
                    />
                </Mask>
            </React.Fragment>
        </globalContext.Provider>
    );
}