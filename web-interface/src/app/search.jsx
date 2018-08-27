import React from 'react';
import {Icon, Menu, Label, Image} from 'semantic-ui-react';
import {connect} from 'react-redux';

const headerStyle = {
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 1,
  backgroundColor: 'white',
};

const labelStyle = {
  bottom: 0,
  left: '1em',
  top: 'initial',
};

// TODO: Update <Search> usage after its will be implemented

class Search extends React.Component {
  constructor (...args) {
    super (...args);
    const ws = new WebSocket (`ws://${window.location.host}/echo`);
    this.state = {
      beatport: 0,
      discogs: 0,
      youtube: 0,
      deejay: 0,
    };
    ws.addEventListener ('open', ev => {
      ws.send (JSON.stringify ({type: 'ECHO', data: 'asd'}));
    });

    ws.onmessage = ev => {
      const {type, data} = JSON.parse (ev.data);
      if (type === 'CRAWLER_ADD') {
        this.setState (data);
      }
    };

    this.ws = ws;
  }

  render () {
    return (
      <div style={headerStyle}>
        <Menu attached="top">
          <Menu.Menu position="right" compact>
            <Menu.Item as="a" onClick={this.props.toggle}>
              <Icon name="filter" size="large" />
            </Menu.Item>
          </Menu.Menu>

          <div
            className="ui left aligned category search item"
            style={{flex: 3}}
          >
            <div className="ui transparent icon input">
              <input
                className="prompt"
                type="text"
                placeholder="Search releases..."
                onChange={ev => {
                  this.props.updateSearch ({key: 'searchString', value: ev.target.value});
                }}
              />
              <i className="search link icon" onClick={this.props.submit}/>
            </div>
            <div className="results" />
          </div>
          <Menu.Menu position="right" compact>
            <Menu.Item as="a">
              <Image src="/assets/youtube.jpg" size="mini" />
              <Label color="red" style={labelStyle} floating>
                {this.state.youtube}
              </Label>
            </Menu.Item>
            <Menu.Item as="a">
              <Image src="/assets/discogs.png" size="mini" />
              <Label color="red" style={labelStyle} floating>
                {this.state.discogs}
              </Label>
            </Menu.Item>
            <Menu.Item as="a">
              <Image src="/assets/beatport.png" size="mini" />
              <Label color="red" style={labelStyle} floating>
                {this.state.beatport}
              </Label>
            </Menu.Item>
            <Menu.Item as="a">
              <Image src="/assets/deejay.jpg" size="mini" />
              <Label color="red" style={labelStyle} floating>
                {this.state.deejay}
              </Label>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

const mapState = state => ({searchString: state.sidebar.form.searchString});
const mapDispatch = ({sidebar}) => ({
  updateSearch: sidebar.changeValue,
  toggle: sidebar.toggle,
  submit: sidebar.submit,
});

export default connect (mapState, mapDispatch) (Search);
