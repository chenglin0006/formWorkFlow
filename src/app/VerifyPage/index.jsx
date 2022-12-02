/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import VerifySlideFixed from '@/components/Verify/VerifySlideFixed';
import './index.less';

class VerifyFix extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      isSlideShow: true,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  closeBox = () => {
    this.setState({ isSlideShow: false });
    const msg = {
      type: 'cancel',
    };
    this.postMessgaeData(msg);
  };

  onVerifySuccess = (params) => {
    this.setState({ isSlideShow: false });
    const msg = {
      type: 'success',
      captchaVerification: params.captchaVerification,
    };
    this.postMessgaeData(msg);
  };

  postMessgaeData = (data) => {
    console.log('postMessage data', JSON.stringify(data), encodeURIComponent(JSON.stringify(data)));
    window.postMessage(encodeURIComponent(JSON.stringify(data)), window.location.origin);
  };

  render() {
    return (
      <div className="fix-index">
        <VerifySlideFixed
          isSlideShow={this.state.isSlideShow}
          verifyPointFixedChild={() => {}}
          onOK={this.onVerifySuccess}
          getCaptcha={this.props.getCaptcha}
          closeBox={this.closeBox}
          initShow={true}
        />
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    checkCaptcha: dispatch.common.checkCaptcha,
    getCaptcha: dispatch.common.getCaptcha,
  };
};

const mapState = (state) => {
  return {};
};

export default connect(mapState, mapDispatch)(VerifyFix);
