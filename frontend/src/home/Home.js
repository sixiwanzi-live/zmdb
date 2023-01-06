import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { MainPanel } from './MainPanel';
import { Sidebar } from './Sidebar';
import OrganizationsApi from '../api/OrganizationApi';
import AuthorApi from '../api/AuthorApi';
import ClipApi from '../api/ClipApi';
import { context } from './context';
import { context as globalContext } from '../context';

export const Home = () => {
    
    const [organizations, setOrganizations] = React.useState([]);
    const [authors, setAuthors] = React.useState([]);
    const [selectedAuthors, setSelectedAuthors] = React.useState([]);
    const [searchWord, setSearchWord] = React.useState('');
    const [clips, setClips] = React.useState([]);
    const [segmentDisabled, setSegmentDisabled] = React.useState(false);

    const { setLoading, onMessage } = React.useContext(globalContext);

    const params = useParams();

    const onSearch = async (inputText) => {
        if (params.organizationId) {
            if (inputText.length > 0) {
                setSearchWord(inputText);
                setLoading(true);
                try {
                    const json = await ClipApi.findByOrganizationId(params.organizationId, inputText);
                    setClips(json || []);
                } catch (ex) {
                    console.log(ex);
                    if (ex) {
                        onMessage({
                            type: 'error',
                            content: `${ex.code}:${ex.message}`
                        });
                    } else {
                        onMessage({
                            type: 'error',
                            content: '内部错误'
                        });
                    }
                }
                setLoading(false);
            } else {
                try {
                    const json = await ClipApi.findByOrganizationId(params.organizationId);
                    setClips(json || []);
                } catch (ex) {
                    console.log(ex);
                    if (ex) {
                        onMessage({
                            type: 'error',
                            content: `${ex.code}:${ex.message}`
                        });
                    } else {
                        onMessage({
                            type: 'error',
                            content: '内部错误'
                        });
                    }
                }
            }
        }
    }

    React.useEffect(() => {
        (async () => {
            const json = await OrganizationsApi.findAll();
            setOrganizations(json || []);
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            if (params.organizationId) {
                try {
                    const json1 = await AuthorApi.findByOrganizationId(params.organizationId);
                    const authors = json1 || [];
                    setAuthors(authors);
                    setSelectedAuthors(authors);
                    const json2 = await ClipApi.findByOrganizationId(params.organizationId);
                    setClips(json2 || []);
                } catch (ex) {
                    console.log(ex);
                    if (ex) {
                        onMessage({
                            type: 'error',
                            content: `${ex.code}:${ex.message}`
                        });
                    } else {
                        onMessage({
                            type: 'error',
                            content: '内部错误'
                        });
                    }
                }
            } else {
                setSearchWord('');
                setAuthors([]);
                setSelectedAuthors([]);
                setClips([]);
            }
        })();
    }, [params]);

    const value = {
        organizations,
        authors,
        selectedAuthors,
        searchWord,
        clips,
        onSearch,
        setSelectedAuthors,
        segmentDisabled,
        setSegmentDisabled
    };

    return (
        <context.Provider value={value}>
            <Box sx = {{ display: 'flex', width:'100%' }}>
                <Box sx={{ flex: 0, flexGrow: '1', p: '2rem 1rem' }}>
                    <Sidebar />
                </Box>
                <Box sx={{ flex: 0, flexGrow: '4', p: '2rem 1rem' }}>
                    <MainPanel />
                </Box>
            </Box>
        </context.Provider>
    );
}