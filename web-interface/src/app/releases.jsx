import React from 'react';
import {Card, Image} from 'semantic-ui-react';
import {connect} from 'react-redux';
import Login from './login';

const getColor = r => {
  if (r.user_data.in_collection) {
    return 'green';
  }

  if (r.viewed) {
    return 'yellow';
  }

  if (r.user_data.in_wantlist) {
    return 'red';
  }
};

const ConnectedList = ({releases, openDialog, loggedIn}) => {
  let cmp = null;
  if (loggedIn) {
    cmp = (
      <Card.Group
        style={{paddingBottom: 80, justifyContent: 'center', paddingTop: 120}}
      >
        {releases.map ((r, index) => (
          <Card
            color={getColor (r)}
            // link="true"
            onClick={() => openDialog ({id: r.catno})}
            style={{zIndex: 0}}
            key={index}
          >
            <Image
              src={
                r.cover_image.indexOf ('spacer.gif') === -1
                  ? r.cover_image
                  : 'https://cdn.shopify.com/s/files/1/1314/4071/products/Black-Vinyl_copy.png'
              }
              bordered
              size="medium"
            />
            <Card.Content>
              <Card.Header>{r.title}</Card.Header>
              <Card.Meta>{r.artist}</Card.Meta>
              <Card.Description>{r.catno}</Card.Description>
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
