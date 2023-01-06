import * as React from 'react';
import { 
    Button,
    TabBar,
    Popup,
    CheckList,
    Avatar,
    Form,
    Input
} from 'antd-mobile';

import { 
    TeamOutline,
    SmileOutline,
    SearchOutline
} from 'antd-mobile-icons';

import { context as globalContext } from './context';

export const Footer = () => {

    const { 
        onSelectOrganization, 
        organizations,
        authors, 
        selectedAuthors,
        setSelectedAuthors,
        searchText,
        onSearch,
    } = React.useContext(globalContext);

    const [activeKey, setActiveKey] = React.useState(0);
    const [organizationVisible, setOrganizationVisible] = React.useState(false);
    const [authorVisible, setAuthorVisible] = React.useState(false);
    const [searchVisible, setSearchVisible] = React.useState(false);

    const [searchForm] = Form.useForm();

    const onCloseOrganizationPopup = () => {
        setOrganizationVisible(false);
        setActiveKey(0);
    }

    const onCloseAuthorPopup = () => {
        setAuthorVisible(false);
        setActiveKey(0);
    }

    const onCloseSearchPopup = () => {
        setSearchVisible(false);
        setActiveKey(0);
    }

    const onTabBarChange = (key) => {
        setActiveKey(-1);
        if (key === "1") {
            setOrganizationVisible(true);
        } else if (key === "2") {
            if (authors.length > 0) {
                setAuthorVisible(true);
            }
        } else if (key === "3") {
            setSearchVisible(true);
        }
    };

    const onChangeOrganization = async (value) => {
        if (value.length !== 0) {
            await onSelectOrganization(value[0]);
            onCloseOrganizationPopup();
        }
    }

    return (
        <div style={{ borderTop: 'solid 1px var(--adm-color-border)' }}>
            <Popup
                visible={organizationVisible}
                onMaskClick={onCloseOrganizationPopup}
            >
                <div style={{ height: '55vh', overflowY: 'scroll' }}>
                    <CheckList 
                        onChange={onChangeOrganization}>
                        {
                            organizations.map(organization => (
                                <CheckList.Item 
                                    key={organization.id} 
                                    value={organization}
                                    prefix={<Avatar src={`//${organization.avatar}@100w_100h_1c_1s.webp`} style={{ "--border-radius":"44px" }} />}
                                >
                                    {organization.name}
                                </CheckList.Item>
                            ))
                        }
                    </CheckList>
                </div>
            </Popup>
            <Popup
                visible={authorVisible}
                onMaskClick={onCloseAuthorPopup}
            >
                <div>
                    <CheckList 
                        multiple={true}
                        value={selectedAuthors}
                        onChange={setSelectedAuthors}>
                        {
                            authors.map(author => (
                                <CheckList.Item 
                                    key={author.id} 
                                    value={author}
                                    prefix={<Avatar src={`http://${author.avatar}@100w_100h.webp`} style={{ "--border-radius":"44px" }} />}
                                >
                                    {author.name}
                                </CheckList.Item>
                            ))
                        }
                    </CheckList>
                </div>
            </Popup>
            <Popup
                visible={searchVisible}
                onMaskClick={onCloseSearchPopup}
            >
                <Form
                    form={searchForm}
                    onFinish={values => {
                        setSearchVisible(false);
                        onSearch(values.searchText);
                    }}
                    initialValues={{
                        searchText: searchText || ''
                    }}
                    layout='horizontal'
                    footer={
                        <Button block type='submit' color='primary' size='large'>
                            提交
                        </Button>
                    }
                >
                    <Form.Header>搜索</Form.Header>
                    <Form.Item
                        name='searchText'
                        label='关键词'
                        rules={[{ required: true, message: '关键词不能为空' }]}
                    >
                        <Input placeholder='请输入关键词' />
                    </Form.Item>
                </Form>
            </Popup>
            <TabBar
                style={{ backgroundColor:'white' }}
                safeArea
                activeKey={activeKey} 
                onChange={onTabBarChange}
            >
                <TabBar.Item 
                    key={1} 
                    title={"选择社团/组"}
                    icon={<TeamOutline />}
                />
                <TabBar.Item 
                    key={2} 
                    title={"选择主播"} 
                    icon={<SmileOutline />}
                />
                <TabBar.Item 
                    key={3} 
                    title={"搜索"} 
                    icon={<SearchOutline />}
                />
            </TabBar>
        </div>
    );
}