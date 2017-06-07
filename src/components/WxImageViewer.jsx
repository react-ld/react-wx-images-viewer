import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import WrapViewer from './WrapViewer';

import './WxImageViewer.less';

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

// let WxImageViewerRootNode;

/**
 * DOM node singleton
 */
// function getRootNode(){
//   if(!WxImageViewerRootNode){
//     WxImageViewerRootNode = document.createElement('div');
//     document.body.appendChild(WxImageViewer);
//   }

//   return WxImageViewerRootNode;
// }

class WxImageViewer extends Component {

  static propTypes = {
    zIndex: PropTypes.number,
    urls: PropTypes.array.isRequired, // 需要预览的图片http链接列表
    index: PropTypes.number, // 当前显示图片的http链接
    onClose: PropTypes.func.isRequired
  }
  static childContextTypes = {
    onClose: PropTypes.func
  };

  static defaultProps = {
    zIndex: 100,
    index: 0,
  }

  componentDidMount() {
    this.node = document.createElement('div');

    document.body.appendChild(this.node);
    this.renderPortal(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.info('WxImageViewer componentWillReceiveProps');

    this.renderPortal(nextProps);
  }
  
  componentWillUnmount() {
    this.removePortal();
  }

  getChildContext() {
    return {onClose: this.props.onClose};
  }

  removePortal(){
    ReactDOM.unmountComponentAtNode(this.node);

    document.body.removeChild(this.node);
  }
  
  renderPortal(props){
    this.portal = renderSubtreeIntoContainer(this,
      <WrapViewer
        {...props}
      />, this.node);
  }

  render() {
    return null;
  }
}

export default WxImageViewer;