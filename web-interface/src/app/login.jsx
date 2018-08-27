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
      <input
        placeholder="Username"
        value={props.credentials.username}
        onChange={ev =>
          props.typeKey ({key: 'username', value: ev.target.value})}
      />
    </Form.Field>
    <Form.Field>
      <label>Password</label>
      <input
        placeholder="Password"
        type="password"
        value={props.credentials.password}
        onChange={ev =>
          props.typeKey ({key: 'password', value: ev.target.value})}
      />
    </Form.Field>
    <Button type="submit" onClick={props.login}>Submit</Button>
  </Form>
);

const mapState = state => ({
  credentials: state.user.credentials,
});
const mapDispatch = ({user}) => ({
  login: user.login,
  typeKey: user.typeKey,
});

export default connect (mapState, mapDispatch) (Login);
