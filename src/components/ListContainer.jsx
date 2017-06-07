import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';

import ImageContainer from './ImageContainer'

class HandleWrapContainer extends PureComponent {

  state = {
    left: 0,
    isNeedSpring: false
  }

  handleTouchStart = (event) =>{
    console.info("handleTouchStart")
    let targetEvent = event.changedTouches[0];
    this.startX = targetEvent.clientX;
    this.startY = targetEvent.clientY;

    this.startLeft = this.state.left;
    this.setState({
      isNeedSpring: false
    })
    event.preventDefault();
  }

  handleTouchMove = (event) =>{
    // console.info("handleTouchMove")
    let targetEvent = event.changedTouches[0],
      diffX = targetEvent.clientX - this.startX,
      left = this.startLeft + diffX;

    this.setState({left})
    event.preventDefault();
  }

  handleTouchEnd = (event) =>{
    console.info("handleTouchEnd")

    let left = Math.round(this.state.left/this.props.diff)*this.props.diff
    if(left > 0){ left = 0}
    if(left < -this.props.maxW){ left = -this.props.maxW}
    this.setState({
      left,
      isNeedSpring: true
    })
    event.preventDefault();
  }

  render(){
    const {
      children,
      style,
    } = this.props

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
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
                style={defaultStyle}
                >
                { children }
              </div>
            )
          }
        }
      </Motion>
    )
  }
}

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

  handleStart = () =>{
    console.info("ListContainer handleStart")
    this.startLeft = this.state.left;
    this.setState({
      isNeedSpring: false
    })
  }

  handleMove = (diffX) =>{
    console.info("ListContainer handleStart diffX = %s",diffX);

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