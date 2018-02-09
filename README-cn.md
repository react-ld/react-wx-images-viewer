# [English](https://github.com/react-ld/react-wx-images-viewer/tree/master)

# 描述
[react-wx-images-viewer](https://github.com/react-ld/react-wx-images-viewer/tree/master)是一个通用型的移动端图片浏览 React 组件。主要功能仿照微信图片浏览功能开发。支持单指左右滑动切换图片，双指拖拽放大缩小图片。

通过 ReactDOM 在 body 根级创建独立的 div 进行渲染，参考 [react-modal](https://github.com/reactjs/react-modal) 使用 ReactDOM.unstable_renderSubtreeIntoContainer 进行渲染

# 依赖关系
version 0.0.1 -> React ^15.5.4

version ^1.0.0 -> React ^16.0.0

# 示例
- [demo1](https://react-ld.github.io/react-wx-images-viewer/index.html)

# 基础功能
- 多图左右切换浏览，不支持循环
- 图片默认样式：水平方向与屏幕等宽，垂直方向居中或者居顶
- 支持图片缩放浏览
- 单指左右滑动切换图片，双指拖拽放到或缩小图片

# 扩展
- 有默认加载图片动效
- 可配置图层深度即 zIndex
- 可配置初始显示图片序号
- TODO：指示器可通过 React 组件方式自定义
- TODO：加载动效可通过 React 组件方式自定义

# 安装
```shell
npm install --save react-wx-images-viewer
```

# 使用
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

# 接口
| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| maxZoomNum | 图片放大最大倍数 | Number | 4 |  |
| zIndex | 组件图层深度 | Number | 100 |  |
| index | 初始显示图片序号 | Number | 0 | |
| gap | 图片之间的间隙 | Number | 10 | unit is pixel |
| urls | 图片 URL 数组 | Array | | suggest the array length do not more than 10 |
| onClose | 关闭的回调处理函数 | Function | | 需要通过该函数将组件从渲染中移除 |
| loading | 自定义图片加载组件 | component | WxImageViewer default [Loading](./src/components/Loading.jsx) | TODO |
| pointer | 自定义指示器组件 | component | WxImageViewer default [Pointer](./src/components/Pointer.jsx) | TODO |

# 参考
- [react-modal](https://github.com/reactjs/react-modal)
- [react-viewer-mobile](https://github.com/infeng/react-viewer-mobile/)
- [react-image](https://github.com/mbrevda/react-image)