import React, { Component } from 'react';
// import { render } from 'react-dom';
// import PropTypes from 'prop-types';

import WxImageViewer from 'index.js';
import './App.less';

class App extends Component {
  state = {
    imags: [
      /* eslint-disable */
      require('./assets/2.jpg'),
      require('./assets/1.jpg'),
      require('./assets/0.jpg'),
      require('./assets/3.jpg'),
      require('./assets/4.jpg'),
      /* eslint-enable */
    ],
    index: 0,
    isOpen: false,
  };

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  }

  openViewer(index) {
    this.setState({
      index,
      isOpen: true,
    });
  }

  render() {
    const {
      imags,
      index,
      isOpen,
    } = this.state;

    return (
      <div className="app">
        <div className="img-list">
          <button onClick={this.openViewer.bind(this, 0)}>点击打开图片</button>
          {
            imags.map((item, subIndex) => {
              return (
                <div className="img" key={item}>
                  <img src={item} alt="" onClick={this.openViewer.bind(this, subIndex)} width="100%" height="auto" className="" />
                </div>
              );
            })
          }
        </div>
        {
          isOpen ? <WxImageViewer onClose={this.onClose} urls={imags} index={index} /> : ''
        }
      </div>
    );
  }
}

export default App;
