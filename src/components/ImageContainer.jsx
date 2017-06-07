import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const IMG_RESET_SIZE = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
}

/**
 * 图片实际尺寸： actualWith, actualHeight
 * 图片初始尺寸： originWidth, originHeight
 * 坐标位置：left, top
 * 放大倍数：zoom
 * 最大放大倍数：maxZoomNum
 * 坐标关系：-(maxZoomNum - 1) * originWidth / 2 < left < 0
 *         -(maxZoomNum - 1) * originHeight / 2 < top < 0
 * 尺寸关系：width = zoom * originWidth
 *         heigth = zoom * originHeight
 * 
 * 放大点位置关系：
 * 初始点位置：oldPointLeft, oldPointTop
 * 放大后位置：newPointLeft, newPointTop
 * 对应关系： newPointLeft = zoom * oldPointLeft
 *          newPointTop = zoom * oldPointTop
 * 
 * 坐标位置：left = (newPointLeft - oldPointLeft) = (zoom - 1) * oldPointLeft
 *         top = (newPointTop - oldPointTop) = (zoom - 1) * oldPointTop
 */

function setScope(value, min, max){
  if(value < min){ return min}
  if(value > max){ return max}
  return value;
}

class ImageContainer extends PureComponent {
  static propTypes = {
    maxZoomNum: PropTypes.number,
  }

  static defaultProps = {
    maxZoomNum: 4,
  }

  state = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    isLoading: false,
    isLoaded: false
  }

  componentDidMount() {
    this.loadImg(this.props.src);
  }

  componentWillUnmount() {
    this.unloadImg();
  }

  handleTouchStart = (event) =>{
    console.info("handleTouchStart")

    switch (event.touches.length) {
      case 1:
      	// event.preventDefault();
		    // event.stopPropagation();
        let targetEvent = event.touches[0];
        this.startX = targetEvent.clientX;
        this.startY = targetEvent.clientY;

        this.startLeft = this.state.left;
        this.startTop = this.state.top;
      break;

      case 2: //两个手指
      	event.preventDefault();
		    event.stopPropagation();

        this.isTwoFinger = true;

        //计算两个手指中间点屏幕上的坐标
        const middlePointClientLeft = Math.abs(Math.round((event.touches[ 0 ].clientX + event.touches[ 1 ].clientX) / 2));
        const middlePointClientTop = Math.abs(Math.round((event.touches[ 0 ].clientY + event.touches[ 1 ].clientY) / 2));

        //保存图片初始位置和尺寸
        this.startLeft = this.state.left;
        this.startTop = this.state.top;
        this.startWidth = this.state.width;
        this.startHeight = this.state.height;
        
        //计算手指中间点在图片上的位置（坐标值）
        this.oldPointLeft = middlePointClientLeft - this.startLeft;
        this.oldPointTop = middlePointClientTop - this.startTop;
        console.info("this.oldPointLeft = %s; this.oldPointTop = %s", this.oldPointLeft, this.oldPointTop);

				var dx = event.touches[ 0 ].clientX - event.touches[ 1 ].clientX;
				var dy = event.touches[ 0 ].clientY - event.touches[ 1 ].clientY;
        this._touchZoomDistanceStart = this._touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

        console.info("this._touchZoomDistanceStart = ", this._touchZoomDistanceStart);
      break;

      default:
      break;
    }
  }

  handleTouchMove = (event) =>{
    // console.info("handleTouchMove = %s",event.touches[ 0 ].clientX)

    switch (event.touches.length) {
      case 1:
        let targetEvent = event.touches[0],
          diffX = targetEvent.clientX - this.startX,
          diffY = targetEvent.clientY - this.startY;

        
        let top = (this.props.screenHeight - this.state.height)/2,
          left = setScope(this.startLeft + diffX, ( this.originWidth - this.state.width ), 0 );

        if(this.state.height > this.props.screenHeight){
          top = setScope(this.startTop + diffY, ( this.props.screenHeight - this.state.height ), 0 );
        }

        console.info("this.startX = %s, this.startY = %s, this.startLeft = %s, this.startTop = %s, diffX = %s, diffY = %s", this.startX, this.startY, this.startLeft, this.startTop, diffX, diffY);
        this.setState({
          left,
          top
        })
        if(this.startLeft + diffX < 0 && this.startLeft + diffX > this.originWidth - this.state.width){
          event.preventDefault();
          event.stopPropagation();
        }
        // this.setState((prevState, props) => {
        //   let top = (props.screenHeight - prevState.height)/2,
        //     left = setScope(this.startLeft + diffX, ( this.originWidth - prevState.width ), 0 );

        //   if(prevState.height > props.screenHeight){
        //     top = setScope(this.startTop + diffY, ( props.screenHeight - prevState.height ), 0 );
        //   }

        //   console.info("left = %s ; top = %s", left, top);
        //   return {
        //     left,
        //     top
        //   }
        // })
      break;

      case 2: //两个手指
      	event.preventDefault();
		    event.stopPropagation();

				var dx = event.touches[ 0 ].clientX - event.touches[ 1 ].clientX;
				var dy = event.touches[ 0 ].clientY - event.touches[ 1 ].clientY;
        this._touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );
        console.info("this._touchZoomDistanceEnd = ", this._touchZoomDistanceEnd);

        let zoom = Math.sqrt(this._touchZoomDistanceEnd / this._touchZoomDistanceStart);

        this.setState((prevState, props) => {
          let left = this.startLeft + (1 - zoom) * this.oldPointLeft,
            top = this.startTop + (1 - zoom) * this.oldPointTop,
            width = zoom * this.startWidth,
            height = zoom * this.startHeight;

          console.info("zoom = %s, left = %s, top = %s, width = %s, height = %s ",zoom, left, top, width, height);
          return{
            left,
            top,
            width,
            height,
          }
        })
      break;

      default:
      break;
    }
  }

  handleTouchEnd = (event) =>{
    console.info("handleTouchEnd", event.touches.length);
    if(this.isTwoFinger){
      this.isTwoFinger = false;
      let left, top, width, height;

      width = setScope(this.state.width, this.originWidth, this.props.maxZoomNum * this.originWidth);
      height = setScope(this.state.height, this.originHeight, this.props.maxZoomNum * this.originHeight);

      let zoom = width / this.startWidth;

      left = setScope(this.startLeft + (1 - zoom) * this.oldPointLeft, this.originWidth - width, 0);

      if(height > this.props.screenHeight){
        top = setScope(this.startTop + (1 - zoom) * this.oldPointTop, this.props.screenHeight - height, 0);
      } else{
        top = (this.props.screenHeight - height) / 2;
      }

      console.info("zoom = %s, left = %s, top = %s, width=%s, height= %s", zoom, left, top,width,height);
      this.setState({
        width,
        height,
        left,
        top
      })
      if(event.touches.length === 1){
      	event.preventDefault();
		    event.stopPropagation();
        let targetEvent = event.touches[0];
        this.startX = targetEvent.clientX;
        this.startY = targetEvent.clientY;

        this.startLeft = left;
        this.startTop = top;
        console.info("this.startX = %s, this.startY = %s, this.startLeft = %s, this.startTop = %s", this.startX, this.startY, this.startLeft, this.startTop);
      }
    }
  }

  onLoad = () => {
    this.actualWith = this.img.width;
    this.actualHeight = this.img.height;

    const {
      screenHeight,
      screenWidth
    } = this.props

    let left = 0, top = 0;

    this.originWidth = screenWidth;
    this.originHeight = this.actualHeight / this.actualWith * screenWidth;

    if(this.actualHeight / this.actualWith < screenHeight / screenWidth){
      top = parseInt((screenHeight - this.originHeight) / 2)
    }
    this.originTop = top;

    this.setState({
      width: this.originWidth,
      height: this.originHeight,
      left,
      top,
      isLoading: false,
      isLoaded: true,
    })
  }

  onError = () => {
    this.setState({
      isLoading: false,
      isLoaded: true,
    })
  }

  loadImg = (url) => {
    this.img = new Image()
    this.img.src = url
    this.img.onload = this.onLoad
    this.img.onerror = this.onError

    this.setState({
      isLoading: true,
      isLoaded: false,
    })
  }

  unloadImg = () => {
    delete this.img.onerror
    delete this.img.onload
    delete this.img.src
    delete this.img
  }

  render() {
    const {
      screenWidth,
      screenHeight,
      src,
      left,
    } = this.props;

    const {
      isLoaded,
      isLoading,
      ...ImageStyle
    } = this.state

    let defaultStyle = {
      left: left,
      width: screenWidth,
      height: screenHeight
    }

    return (
      <div 
        className="viewer-image-container"
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        style={defaultStyle}>
        {
          isLoaded ? <img src={src} style={ImageStyle}/> : ''
        }
      </div>
    );
  }
}

export default ImageContainer;