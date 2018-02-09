# [中文文档](https://github.com/react-ld/react-wx-images-viewer/blob/master/README-cn.md)

# Description
[react-wx-images-viewer](https://github.com/react-ld/react-wx-images-viewer/tree/master) is a React
common component use for images viewer *in mobile device*. It's function look like WeChat App previewImage.
Finger drag left or right to preview each image. Two finger drag zoom in or zoom out the image.

# Install
```shell
npm install --save react-wx-images-viewer
```

# dependence
version 0.0.1 -> React ^15.5.4

version ^1.0.0 -> React ^16.0.0

# Example
- [demo1](https://react-ld.github.io/react-wx-images-viewer/index.html)

# How to use
```js
import WxImageViewer from 'react-wx-images-viewer';
class App extends Component {

  state = {
    imags: [
      require('./assets/2.jpg'),
      require('./assets/1.jpg'),
      require('./assets/0.jpg'),
      require('./assets/3.jpg'),
      require('./assets/4.jpg'),
    ],
    index: 0,
    isOpen: false
  };

  onClose = () =>{
    this.setState({
      isOpen: false
    })
  }

  openViewer (index){
    this.setState({
      index,
      isOpen: true
    })
  }

  render() {
    const {
      imags,
      index,
      isOpen
    } = this.state;

    return (
      <div className="app">
        <div className="img-list">
          {/*直接打开*/}
          <button onClick={this.openViewer.bind(this, 0)}>点击打开图片</button>
          {
            this.state.imags.map((item, index) => {
              return <div className="img" key={item}>
                <img src={item} alt="" onClick={this.openViewer.bind(this, index)} width="100%" height="auto" className=""/> 
              </div>
            })
          }
        </div>
        {
          isOpen ? <WxImageViewer onClose={this.onClose} urls={this.state.imags} index={index}/> : ""
        }
      </div>
    )
  }
}

export default App;
```

# API：
| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| maxZoomNum | max zoom in times | Number | 4 |  |
| zIndex | the depth of the layer | Number | 100 |  |
| index | show which image in urls array when open | Number | 0 | |
| gap | the gap between images | Number | 10 | unit is pixel |
| urls | images url array | Array | | suggest the array length do not more than 10 |
| onClose | handle close function | Function | | must remove WxViewer from current render and other sepcial logic |
| loading | DIY loading style | component | WxImageViewer default [Loading](./src/components/Loading.jsx) | TODO |
| pointer | DIY pointer | component | WxImageViewer default [Pointer](./src/components/Pointer.jsx) | TODO |

# Reference
- [react-modal](https://github.com/reactjs/react-modal)
- [react-viewer-mobile](https://github.com/infeng/react-viewer-mobile/)
- [react-image](https://github.com/mbrevda/react-image)