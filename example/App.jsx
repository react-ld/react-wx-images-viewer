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
    ]
  };

  render() {
    return (
      <div className="app">
        <div className="img-list">
          {
            this.state.imags.map(item => {
              console.info("111",item);
              return <div className="img">
                <img src={item} alt="" width="100%" height="auto" className=""/> 
              </div>
            })
          }
        </div>
        <WxImageViewer urls={this.state.imags} index={2}/>
      </div>
    )
  }
}

export default App;