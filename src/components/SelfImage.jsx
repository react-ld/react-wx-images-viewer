import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ImageContainer extends PureComponent {

  render() {
    const {
      screenWidth,
      screenHeight,
      src,
      left,
    } = this.props;

    let defaultStyle = {
      left: left
    }

    return (
      <div className="viewer-image-container" style={defaultStyle}>
        <img src={src} width="100%" alt=""/>
      </div>
    );
  }
}

export default ImageContainer;