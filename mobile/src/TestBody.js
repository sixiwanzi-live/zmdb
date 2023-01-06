import { 
    List
} from 'antd-mobile';
import ArtPlayer from './ArtPlayer';
 
// These row heights are arbitrary.
// Yours should be based on the content of the row.

 
export const TestBody = () => (
<div>
    <ArtPlayer
        option={{
            title: 'One More Time One More Chance',
            url: `https://artplayer.org/assets/sample/video.mp4`,
        }}
        style={{
            width: '100%',
            height: '240px',
            zIndex:10, 
            backgroundColor:'white'
        }}
        getInstance={(art) => console.log(art)}
    />
</div>
  
);