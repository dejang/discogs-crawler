import React from 'react';
import Search from './search';
import Releases from './releases';
import Footer from './pagination';
import Dialog from './dialog';
import Sidebar from './sidebar';

export default class App extends React.Component {
  render () {
    return (
      <div className="App">
        <Search />
        <Releases />
        <Footer />
        <Dialog />
        <Sidebar />
      </div>
    );
  }
}
