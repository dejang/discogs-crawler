import React from 'react';
import {Card, Image} from 'semantic-ui-react';
import {connect} from 'react-redux';
import Login from './login';

const ConnectedList = ({releases, openDialog, loggedIn}) => {
  let cmp = null;
  if (loggedIn) {
    cmp = (
      <Card.Group
        style={{paddingBottom: 80, justifyContent: 'center', paddingTop: 120}}
      >
        {releases.map (r => (
          <Card
            color={
              r.user_data.in_collection
                ? 'green'
                : r.user_data.in_wantlist ? 'red' : ''
            }
            // link="true"
            onClick={() => openDialog ({id: r.catno})}
            style={{zIndex: 0}}
          >
            <Image src={r.cover_image} fluid bordered size="medium" />
            <Card.Content>
              <Card.Header>{r.title}</Card.Header>
              <Card.Meta>{r.artist}</Card.Meta>
              <Card.Description>{r.catno}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <span>does not have</span>
            </Card.Content>
          </Card>
        ))}

      </Card.Group>
    );
  } else {
    cmp = <Login />;
  }
  return cmp;
};

const mapState = state => ({
  releases: state.releases,
  loggedIn: state.user.loggedIn,
});

const mapDispatch = ({dialog}) => ({
  openDialog: dialog.openDialog,
});

export default connect (mapState, mapDispatch) (ConnectedList);
