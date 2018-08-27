import React from 'react';
import {Button, Input, Form, Select} from 'semantic-ui-react';
import {connect} from 'react-redux';

const decadeOptions = [
  {key: '1950', value: '1950', text: '1950'},
  {key: '1960', value: '1960', text: '1960'},
  {key: '1970', value: '1970', text: '1970'},
  {key: '1980', value: '1980', text: '1980'},
  {key: '1990', value: '1990', text: '1990'},
  {key: '2000', value: '2000', text: '2000'},
  {key: '2010', value: '2010', text: '2010'},
];

const Sidebar = props => {
  const sidebarStyle = {
    position: 'fixed',
    width: 0,
    height: '100%',
    backgroundColor: 'white',
    top: 63,
    border: '1px solid',
    padding: 10,
    transition: 'width 0.1 ease-in',
    opacity: 0,
    borderTop: 0,
    boxShadow: 'lightgrey 2px 1px 100px',
  };

  if (props.open) {
    sidebarStyle.width = 250;
    sidebarStyle.opacity = 1;
  } else {
    sidebarStyle.width = 0;
    sidebarStyle.opacity = 0;
  }
  return (
    <div style={sidebarStyle}>
      <Form onSubmit={props.submit}>
        <Form.Field>
          <label>Decade</label>
          <Select
            placeholder="Select Decade"
            options={decadeOptions}
            value={props.form.decade}
            name="decade"
            onChange={(ev, {name, value}) => {
              props.changeDecade ({key: name, value});
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Year</label>
          <Select
            placeholder="Select Year"
            options={props.years}
            name="year"
            value={props.form.year}
            onChange={(ev, {name, value}) => {
              props.changeValue ({key: name, value});
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Style</label>
          <Select
            placeholder="Select Style"
            options={props.styles}
            name="style"
            value={props.form.style}
            onChange={(ev, {name, value}) => {
              props.changeValue ({key: name, value});
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Page</label>
          <Select
            placeholder="Select Page"
            options={props.pages}
            value={props.form.page}
            name="page"
            onChange={(ev, {name, value}) => {
              props.changeValue ({key: name, value});
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Format</label>
          <Select
            placeholder="Select Format"
            options={props.format}
            value={props.form.format}
            name="format"
            onChange={(ev, {name, value}) => {
              props.changeValue ({key: name, value});
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Discogs Token</label>
          <Input
            placeholder="YOUR_DISCOGS_TOKEN_HERE"
            value={props.discogsToken}
            onChange={ev => {
              props.changeToken (ev.target.value);
            }}
          />
        </Form.Field>
        <Button type="submit" primary onClick={props.submit}>Submit</Button>
        <Button type="clear" secondary onClick={props.clear}>Clear</Button>
      </Form>
    </div>
  );
};

const mapState = state => {
  return state.sidebar;
};

const mapDispatch = ({sidebar, user}) => ({
  submit: sidebar.submit,
  changeValue: sidebar.changeValue,
  changeDecade: sidebar.changeDecade,
  clear: sidebar.clear,
  changeToken: user.updateDiscogsToken
});

export default connect (mapState, mapDispatch) (Sidebar);
