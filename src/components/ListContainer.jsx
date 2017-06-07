import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';

import ImageContainer from './ImageContainer'

class ListContainer extends PureComponent {
  static propTypes = {
    gap: PropTypes.number,
  }

  static defaultProps = {
    gap: 10,
  }

  state = {
    left: 0,
    isNeedSpring: false
  }

  componentWillMount() {
    const {
      screenWidth,
      urls,
      index,
      gap
    } = this.props;

    this.length = urls.length;
    this.perDistance = screenWidth + gap;
    this.maxLeft = this.perDistance * (this.length - 1);

    this.setState({
      left: - this.perDistance * index,
      isNeedSpring: false
    })
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

  handleStart = () =>{
    console.info("ListContainer handleStart")
    this.startLeft = this.state.left;
    this.setState({
      isNeedSpring: false
    })
  }

  handleMove = (diffX) =>{
    console.info("ListContainer handleStart diffX = %s",diffX);
    if(this.state.left >= 0 && diffX > 0){
      diffX = this.easing(diffX);
    } else if(this.state.left <= - this.maxLeft && diffX < 0){
      diffX = -this.easing(-diffX);
    }
    this.setState({
      left: this.startLeft + diffX,
      isNeedSpring: false
    })
  }

  handleEnd = () =>{
    let left = Math.round(this.state.left / this.perDistance) * this.perDistance
    if(left > 0){ left = 0}
    if(left < -this.maxLeft){ left = -this.maxLeft}
    this.setState({
      left,
      isNeedSpring: true
    })
  }

  render() {
    const {
      screenWidth,
      screenHeight,
      urls,
      index,
      gap
    } = this.props;

    const {
      left,
      isNeedSpring
    } = this.state

    return (
      <Motion style={{x: isNeedSpring ? spring(left) : left}}>
        {
          ({x}) => {
            let defaultStyle = {
              WebkitTransform: `translate3d(${x}px, 0, 0)`,
              transform: `translate3d(${x}px, 0, 0)`,
            }

            return (
              <div 
                className="viewer-list-container"
                style={defaultStyle}
                >
                { 
                  urls.map((item,i) => <ImageContainer
                  key={i}
                  src={item}
                  handleStart={this.handleStart}
                  handleMove={this.handleMove}
                  handleEnd={this.handleEnd}
                  left={this.perDistance * i}
                  screenWidth={screenWidth}
                  screenHeight={screenHeight}/>)
                }
              </div>
            )
          }
        }
      </Motion>
      /*<HandleWrapContainer 
        style={defaultStyle}
        diff={screenWidth + gap}
        maxW={(screenWidth + gap)*(urls.length-1)}>
        { 
          urls.map((item,i) => <ImageContainer
          key={i}
          src={item}
          left={this.perDistance * i}
          screenWidth={screenWidth}
          screenHeight={screenHeight}/>)
        }
      </HandleWrapContainer>*/
    );
  }
}

export default ListContainer;