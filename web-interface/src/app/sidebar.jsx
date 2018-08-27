import React from 'react';
import {Button, Checkbox, Form, Select} from 'semantic-ui-react';
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
        {console.log (props.years[0] && props.years[0].value)}
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
        <Button type="submit" primary onClick={props.submit}>Submit</Button>
        <Button type="clear" secondary>Clear</Button>
      </Form>
    </div>
  );
};

const mapState = state => {
  return state.sidebar;
};

const mapDispatch = ({sidebar}) => ({
  submit: sidebar.submit,
  changeValue: sidebar.changeValue,
  changeDecade: sidebar.changeDecade,
});

export default connect (mapState, mapDispatch) (Sidebar);
