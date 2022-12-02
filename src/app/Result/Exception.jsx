import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tools } from '@/util';
import Error from '@/components/Exception/error';

class Exception extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      code: decodeURIComponent(Tools.getUrlArg('code')) || 'error',
      msg: decodeURIComponent(Tools.getUrlArg('msg')) || '',
    };
  }

  componentDidMount() {}

  render() {
    const { code, msg } = this.state;

    return (
      <span>
        <Error code={code} msg={msg} />
      </span>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    login: dispatch.common.login,
    querySms: dispatch.common.querySms,
    checkIfBind: dispatch.common.checkIfBind,
  };
};

const mapState = (state) => {
  return {
    status: state.common.status,
    message: state.common.message,
    submitLoading: state.loading.effects.common.login,
  };
};

export default connect(mapState, mapDispatch)(Exception);
