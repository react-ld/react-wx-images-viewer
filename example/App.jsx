import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import WxImageViewer from 'index.js';
import './App.less';

class App extends Component {

  state = {
    imags: [
      require('./assets/2.jpg'),
      require('./assets/1.jpg'),
      require('./assets/0.jpg'),
      require('./assets/3.jpg'),
      require('./assets/4.jpg'),
    ],
    index: 0,
    isOpen: false
  };

  onClose = () =>{
    this.setState({
      isOpen: false
    })
  }

  openViewer (index){
    this.setState({
      index,
      isOpen: true
    })
  }

  render() {
    const {
      imags,
      index,
      isOpen
    } = this.state;

    return (
      <div className="app">
        <div className="img-list">
          {
            this.state.imags.map((item, index) => {
              console.info("111",item);
              return <div className="img" key={item}>
                <img src={item} alt="" onClick={this.openViewer.bind(this, index)} width="100%" height="auto" className=""/> 
              </div>
            })
          }
        </div>
        {
          isOpen ? <WxImageViewer onClose={this.onClose} urls={this.state.imags} index={index}/> : ""
        }
      </div>
    )
  }
}

export default App;