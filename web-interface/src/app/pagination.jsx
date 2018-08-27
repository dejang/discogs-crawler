import React from 'react';
import {Container, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';

const containerStyle = {
  display: 'flex',
  alignItems: 'stretch',
  flexDirection: 'row',
  width: '100%',
  position: 'fixed',
  justifyContent: 'center',
  bottom: 0,
};

const pageNumber = {
  position: 'absolute',
  textAlign: 'center',
  borderRadius: '500rem',
  top: '50%',
  left: '50%',
  backgroundColor: '#fff',
  textShadow: 'none',
  marginTop: '-.89285714em',
  marginLeft: '-.89285714em',
  width: '1.78571429em',
  height: '1.78571429em',
  lineHeight: '1.78571429em',
  color: 'rgba(0,0,0,.4)',
  fontStyle: 'normal',
  fontWeight: '700',
  boxShadow: '0 0 0 1px transparent inset',
};

const Pagination = ({nextPage, prevPage, page}) => (
  <Container style={containerStyle}>
    <Button.Group>
      <Button
        content="Preview"
        icon="left arrow"
        labelPosition="left"
        onClick={prevPage}
      />
      <span style={pageNumber}>{page}</span>
      <Button
        content="Next"
        icon="right arrow"
        labelPosition="right"
        onClick={nextPage}
      />
    </Button.Group>

  </Container>
);

const mapDispatch = ({sidebar}) => ({
  nextPage: sidebar.nextPage,
  prevPage: sidebar.prevPage,
});

const mapState = state => ({
  page: state.sidebar.form.page,
});

export default connect (mapState, mapDispatch) (Pagination);
