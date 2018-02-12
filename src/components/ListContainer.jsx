import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ImageContainer from './ImageContainer'

//快速拖动时间限制
const DEFAULT_TIME_DIFF = 200;
const DEFAULT_SPEED = 300; // in ms

class ListContainer extends PureComponent {
  static propTypes = {
    maxZoomNum: PropTypes.number.isRequired,
    changeIndex: PropTypes.func.isRequired,
    gap: PropTypes.number.isRequired,
    speed: PropTypes.number, // Duration of transition between slides (in ms)
  }

  state = {
    left: 0,
    speed: DEFAULT_SPEED
  }

  constructor() {
    super();
    this.isNeedSpring = false;
  }

  componentWillMount() {
    const {
      screenWidth,
      urls,
      index,
      changeIndex,
      gap,
      speed
    } = this.props;

    this.length = urls.length;
    this.perDistance = screenWidth + gap;
    this.maxLeft = this.perDistance * (this.length - 1);
    this.isNeedSpring = false;

    this.setState({
      left: - this.perDistance * index,
      speed: speed || DEFAULT_SPEED
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.index !== nextProps.index) {
      this.isNeedSpring = true;
      this.setState({
        left: - this.perDistance * nextProps.index,
      });
    }
  }

  /**
   * 拖拽的缓动公式 - easeOutSine
   * Link http://easings.net/zh-cn#
   * t: current time（当前时间）；
   * b: beginning value（初始值）；
   * c: change in value（变化量）；
   * d: duration（持续时间）。
   */
  easing = (distance) => {
    var t = distance;
    var b = 0;
    var d = this.props.screenWidth; // 允许拖拽的最大距离
    var c = d / 2.5; // 提示标签最大有效拖拽距离

    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

  handleStart = () => {
    // console.info("ListContainer handleStart")
    this.startLeft = this.state.left;
    this.startTime = (new Date()).getTime();
    this.isNeedSpring = false;
  }

  handleMove = (diffX) => {
    // console.info("ListContainer handleStart diffX = %s",diffX);
    //限制最大 diffx 值
    if (Math.abs(diffX) > this.props.screenWidth) {
      if (diffX < 0) { diffX = - this.props.screenWidth }
      if (diffX > 0) { diffX = this.props.screenWidth }
    }

    if (this.state.left >= 0 && diffX > 0) {
      diffX = this.easing(diffX);
    } else if (this.state.left <= - this.maxLeft && diffX < 0) {
      diffX = -this.easing(-diffX);
    }

    this.setState({
      left: this.startLeft + diffX,
    })
  }

  handleEnd = (isAllowChange) => {
    let index, left, diffTime = (new Date()).getTime() - this.startTime;

    //快速拖动情况下切换图片
    if (isAllowChange && diffTime < DEFAULT_TIME_DIFF) {
      if (this.state.left < this.startLeft) {
        index = this.props.index + 1;
      } else {
        index = this.props.index - 1;
      }
    } else {
      index = Math.abs(Math.round(this.state.left / this.perDistance));
    }

    //处理边界情况
    if (index < 0) { index = 0 }
    else if (index > this.length - 1) { index = this.length - 1 }

    this.setState({
      left: - this.perDistance * index,
    })
    this.isNeedSpring = true;
    this.props.changeIndex(index);
  }

  render() {
    const {
      maxZoomNum,
      screenWidth,
      screenHeight,
      index,
      urls,
      gap
    } = this.props;

    const {
      left,
      speed
    } = this.state;

    const defaultStyle = {};

    if(this.isNeedSpring){
      const duration = `${speed}ms`;
      defaultStyle.WebkitTransitionDuration = duration;
      defaultStyle.transitionDuration = duration;
    }
    const translate = `translate3d(${left}px, 0, 0)`
    defaultStyle.WebkitTransform = translate;
    defaultStyle.transform = translate;

    return (
      <div
        className="viewer-list-container"
        style={defaultStyle}
      >
        {
          urls.map((item, i) => <ImageContainer
            key={i}
            src={item}
            maxZoomNum={maxZoomNum}
            handleStart={this.handleStart}
            handleMove={this.handleMove}
            handleEnd={this.handleEnd}
            left={this.perDistance * i}
            screenWidth={screenWidth}
            screenHeight={screenHeight} />)
        }
      </div>
    );
  }
}

export default ListContainer;