import React from 'react'
import { isloading } from '../actions/rootActions'
import { connect } from 'react-redux'

class Bundle extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      mod: null
    }
  }

  unmount = false;

  componentWillMount = () => {
    this.props.dispatch((isloading(true)))
    this.load(this.props)
  }

  componentWillUnmount = () => {
    this.unmount = true
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(props) {
    if (this.state.mod) {
      return true;
    }

    //注意这里，使用Promise对象; mod.default导出默认
    props.load().then((mod) => {
      if (this.unmount) {
        this.props.dispatch(isloading(true));
        return false;
      }
      this.setState({
        mod: mod.default ? mod.default : mod
      }, () => {
        this.props.dispatch(isloading(false))
      })
    })
  }

  render () {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }

}

// 拉入dispatch
export default connect()(Bundle)