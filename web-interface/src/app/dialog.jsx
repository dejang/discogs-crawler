import React from 'react';
import {connect} from 'react-redux';
import {Modal, Label, Image, List, Button} from 'semantic-ui-react';
import YouTube from '@u-wave/react-youtube';

const linkStyle = {
  textDecoration: 'none',
  marginRight: 10,
};

const linkContainerStyle = {
  textAlign: 'center',
};

function getLinks (tracklist, currentIndex, discogs) {
  if (!tracklist[currentIndex]) {
    return <empty />;
  }

  return (
    <div style={linkContainerStyle}>
      <a style={linkStyle} href={discogs} target="_blank">
        <Label>
          <Image src="/assets/discogs.png" size="mini" />
        </Label>
      </a>
      <a
        style={linkStyle}
        href={tracklist[currentIndex].beatport}
        target="_blank"
      >
        <Label color="black">
          <Image src="/assets/beatport.png" size="mini" />
        </Label>
      </a>
      <a
        style={linkStyle}
        href={tracklist[currentIndex].deejay}
        target="_blank"
      >
        <Label color="orange">
          <Image src="/assets/deejay.png" size="mini" />
        </Label>
      </a>
    </div>
  );
}

function Dialog (props) {
  return (
    <Modal open={props.open} size="fullscreen">
      <Modal.Header
      >{`${props.release.artist} - ${props.release.title}`}</Modal.Header>
      <Modal.Content style={{textAlign: 'center'}}>
        <List horizontal ordered>
          {props.release.tracklist.map ((t, index) => {
            return (
              <List.Item onClick={() => props.viewVideo (index)}>
                <Button active={index === props.currentIndex}>{t.title}</Button>
              </List.Item>
            );
          })}
        </List>
      </Modal.Content>
      <Modal.Content>
        {getLinks (
          props.release.tracklist,
          props.currentIndex,
          props.release.discogsUrl
        )}
      </Modal.Content>
      <Modal.Content
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Button onClick={props.prevTrack}>Prev</Button>
        <YouTube
          video={props.videoId}
          width={854}
          height={480}
          autoplay
          controls={true}
          onEnd={props.nextTrack}
        />
        <Button onClick={props.nextTrack}>Next</Button>
      </Modal.Content>
      <Modal.Actions>
        <button onClick={props.closeDialog}>Close</button>
      </Modal.Actions>
    </Modal>
  );
}

const mapState = state => {
  return {...state.dialog};
};

const mapDispatch = ({
  dialog: {closeDialog, viewVideo, nextTrack, prevTrack},
}) => ({
  closeDialog,
  viewVideo,
  nextTrack,
  prevTrack,
});

export default connect (mapState, mapDispatch) (Dialog);
