/* eslint-disable react/prop-types */
/* eslint-disable react/sort-comp */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { connect } from 'react-redux';
import VerifySlideFixed from '@/components/Verify/VerifySlideFixed';

import './index.less';

class Captcha extends Component {
  params = {};

  static propTypes = {
    form: PropTypes.object, // 外层antd form对象
    target: PropTypes.string.isRequired, // 获取验证码的字段，例如手机号或邮箱
    queryCaptcha: PropTypes.func.isRequired, // 获取验证码的方法
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      phoneCount: 0,
      isSlideShow: false,
    };
  }

  componentWillUnmount() {
    clearInterval(this.phoneInterval);
  }

  onGetPhoneCaptcha = () => {
    const { form, target } = this.props;
    console.log(form, 'form');
    form.validateFields([target]).then((values) => {
      console.log(values, 'values');
      this.params = values;
      this.onShowVerify();
    });
  };

  onShowVerify = () => {
    this.setState({
      isSlideShow: true,
    });
  };

  getCaptcha = (params = {}) => {
    const { getCaptcha, target } = this.props;

    return getCaptcha({
      ...params,
      username: this.params && this.params[target],
    });
  };

  verifySlideFixedChild(data) {
    this.setState({
      isSlideShow: data,
    });
  }

  onVerifySuccess = (data = {}) => {
    const { queryCaptcha } = this.props;
    queryCaptcha({
      ...this.params,
      clientUid: data.clientUid,
      captchaVerification: data.captchaVerification,
    });
    let count = 59;
    this.setState({ phoneCount: count });
    this.phoneInterval = setInterval(() => {
      count -= 1;
      this.setState({ phoneCount: count });
      if (count === 0) {
        clearInterval(this.phoneInterval);
      }
    }, 1000);
  };

  render() {
    const { form, target, queryCaptcha, getCaptcha: unUsed, loading, getCaptchaLoading, ...rest } = this.props;

    const { phoneCount } = this.state;

    return (
      <Fragment>
        <div className="bnq-captcha-wrap">
          <div className="bnq-captcha-input">
            <Input {...rest} />
          </div>
          <div className="bnq-captcha-btn-wrap">
            <Button
              type="ghost"
              className="bnq-captcha-btn"
              disabled={phoneCount}
              size={rest.size}
              onClick={this.onGetPhoneCaptcha}
              loading={loading || getCaptchaLoading}
            >
              {phoneCount ? `${phoneCount}s后重新获取` : '获取验证码'}
            </Button>
          </div>
        </div>

        {this.state.isSlideShow && (
          <VerifySlideFixed
            isSlideShow={this.state.isSlideShow}
            verifyPointFixedChild={this.verifySlideFixedChild.bind(this)}
            onOK={this.onVerifySuccess}
            getCaptcha={this.getCaptcha}
          />
        )}
      </Fragment>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    getCaptcha: dispatch.common.getCaptcha,
  };
};

const mapState = (state) => {
  return {
    getCaptchaLoading: state.loading.effects.common.getCaptcha,
  };
};

export default connect(mapState, mapDispatch)(Captcha);
