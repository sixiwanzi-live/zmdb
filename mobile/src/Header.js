import * as React from 'react';
import { 
    NavBar
} from 'antd-mobile';
import { context as globalContext } from './context';

export const Header = () => {

    const { selectedOrganization, selectedClip, setSelectedClip } = React.useContext(globalContext);
    const [headline, setHeadline] = React.useState('');

    const onClose = () => {
        setSelectedClip(null);
    }

    React.useEffect(() => {
        if (selectedClip) {
            setHeadline(selectedClip.title);
        } else if (selectedOrganization) {
            setHeadline(selectedOrganization.name);
        } else {
            setHeadline('字幕库');
        }
    }, [selectedOrganization, selectedClip]);

    return (
        <div>
            <NavBar
                style={{ borderBottom:'1px #eee solid' }}
                backArrow={!!selectedClip}
                onBack={onClose}
            >
                {headline}
            </NavBar>
        </div>
    );
}