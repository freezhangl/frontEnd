/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
// console.log("hello world kerwin")
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<div>
    11111111
</div>,document.getElementById("root"))

import React from 'react'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'

export default class App extends Component {
  render() {
    return (
      <div>App</div>
    )
  }
}
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class index extends Component {
  static propTypes = {second: third}

  render() {
    return (
      <div>index</div>
    )
  }
}

// ReactDOM.render(React.createElement("div",{
//     id:"aaa", 
//     class:"bbb"
// },"111111111"),document.getElementById("root"))

/*
 jsx == js+xml
*/


