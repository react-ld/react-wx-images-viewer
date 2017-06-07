import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListContainer from './ListContainer';

let defaultStyle = {}

const screenWidth = document && document.documentElement.clientWidth;
const screenHeight = document && document.documentElement.clientHeight;

class WrapViewer extends Component {

  static propTypes = {
    zIndex: PropTypes.number,
    urls: PropTypes.array.isRequired, // 需要预览的图片http链接列表
    index: PropTypes.number, // 当前显示图片的http链接
  }

  static defaultProps = {
    zIndex: 100,
  }
  
  render() {
    const {
      zIndex,
      urls,
      index,
      onClose
    } = this.props

    defaultStyle.zIndex = zIndex;

    return (
      <div className="wx-image-viewer" style={defaultStyle}>{/* root */}
        <div className="viewer-cover"></div>
        <ListContainer
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          urls={urls}
          index={index}/>
      </div>
    );
  }
}

export default WrapViewer;