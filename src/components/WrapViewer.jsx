import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListContainer from './ListContainer';
import Pointer from './Pointer';

const screenWidth = typeof document !== 'undefined' && document.documentElement.clientWidth;
const screenHeight = typeof document !== 'undefined' && document.documentElement.clientHeight;

class WrapViewer extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired, // 当前显示图片的http链接
    urls: PropTypes.array.isRequired, // 需要预览的图片http链接列表
    maxZoomNum: PropTypes.number.isRequired, // 最大放大倍数
    zIndex: PropTypes.number.isRequired, // 组件图层深度
    gap: PropTypes.number.isRequired, // 间隙
    speed: PropTypes.number.isRequired, // Duration of transition between slides (in ms)
  }

  state = {
    index: 0,
  }

  componentWillMount() {
    const {
      index,
    } = this.props;

    this.setState({
      index,
    });
  }

  changeIndex = (index) => {
    console.info('changeIndex index = ', index);
    this.setState({
      index,
    });
  }

  render() {
    const {
      zIndex,
      urls,
      maxZoomNum,
      gap,
      speed,
    } = this.props;

    const {
      index,
    } = this.state;

    return (
      <div className="wx-image-viewer" style={{ zIndex }}>{/* root */}
        <div className="viewer-cover" />
        <ListContainer
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          changeIndex={this.changeIndex}
          urls={urls}
          maxZoomNum={maxZoomNum}
          gap={gap}
          speed={speed}
          index={index}
        />
        <Pointer length={urls.length} index={index} changeIndex={this.changeIndex} />
      </div>
    );
  }
}

export default WrapViewer;
