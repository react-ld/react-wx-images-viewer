import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListContainer from './ListContainer';
import Pointer from './Pointer'

let defaultStyle = {}

const screenWidth = document && document.documentElement.clientWidth;
const screenHeight = document && document.documentElement.clientHeight;

class WrapViewer extends Component {

  static propTypes = {
    maxZoomNum: PropTypes.number.isRequired,     //最大放大倍数
    zIndex: PropTypes.number.isRequired,         //组件图层深度
    index: PropTypes.number.isRequired,          // 当前显示图片的http链接
    urls: PropTypes.array.isRequired,            // 需要预览的图片http链接列表
    gap: PropTypes.number.isRequired,            //间隙
  }

  state = {
    index: 0
  }

  componentWillMount() {
    const {
      index,
    } = this.props;

    this.setState({
      index
    })
  }

  changeIndex = (index)=>{
    console.info("changeIndex index = ",index);
    this.setState({
      index
    })
  }
  
  render() {
    const {
      maxZoomNum,
      zIndex,
      urls,
      onClose,
      gap
    } = this.props

    const {
      index
    } = this.state

    defaultStyle.zIndex = zIndex;

    return (
      <div className="wx-image-viewer" style={defaultStyle}>{/* root */}
        <div className="viewer-cover"></div>
        <ListContainer
          maxZoomNum={maxZoomNum}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          changeIndex={this.changeIndex}
          urls={urls}
          gap={gap}
          index={index}/>
        <Pointer length={urls.length} index={index} changeIndex={this.changeIndex}/>
      </div>
    );
  }
}

export default WrapViewer;