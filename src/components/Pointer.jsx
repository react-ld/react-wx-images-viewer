import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Pointer extends PureComponent {
  static propTypes = {
    length: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  }

  render() {
    console.info("Point render")
    
    const {
      length,
      index
    } = this.props
    let i = 0, items = [];
    for(i; i < length; i++){
      if(i === index){
        items.push(<span key={i} className="pointer on"></span>);
      } else{
        items.push(<span key={i} className="pointer"></span>);
      }
    }

    return (
      <div className="viewer-image-pointer">
        {items}
      </div>
    );
  }
}

export default Pointer;