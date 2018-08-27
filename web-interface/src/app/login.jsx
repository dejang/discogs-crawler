import React from 'react';
import {Button, Form} from 'semantic-ui-react';
import {connect} from 'react-redux';

const formStyle = {
  margin: 'auto',
  marginTop: 200,
  width: 250,
};

const Login = props => (
  <Form style={formStyle}>
    <Form.Field>
      <label>Username</label>
      <input placeholder="Username" />
    </Form.Field>
    <Form.Field>
      <label>Password</label>
      <input placeholder="Password" type="password" />
    </Form.Field>
    <Button type="submit" onClick={props.login}>Submit</Button>
  </Form>
);

const mapState = () => {};
const mapDispatch = ({user}) => ({
  login: user.login,
});

export default connect (mapState, mapDispatch) (Login);
