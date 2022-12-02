/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, MobileOutlined, KeyOutlined } from '@ant-design/icons';
import Captcha from '@/components/Inputs/Captcha';
import VerifySlideFixed from '@/components/Verify/VerifySlideFixed';
import { isMobile } from '@/util/const';
import PasswordInput from '@/components/PasswordInput/index';
import './index.less';

const { TabPane } = Tabs;

class LoginForm extends Component {
  active = {
    account: ['username', 'password'],
    mobile: ['mobile', 'captcha'],
  };

  params = {};

  formRef = React.createRef();
  mobileRef = React.createRef();
  accountRef = React.createRef();

  static propTypes = {
    // history: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    // loginAndBind: PropTypes.func.isRequired,
    querySms: PropTypes.func.isRequired,
    submitLoading: PropTypes.bool,
    showThirdLogin: PropTypes.bool,
    getCaptcha: PropTypes.func.isRequired,
    getCaptchaLoading: PropTypes.bool,
  };

  static defaultProps = {
    submitLoading: false,
    showThirdLogin: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      // type: 'mobile', // tab active 移入redux进行控制 => 点击锁icon进行自动切换密码登陆
      passwordDefault: !isMobile,
    };
  }
  // type=>  third:一键登录 mobile:免密登陆 account:密码登陆
  componentDidMount() {
    const { saveUnlock, saveType } = this.props;
    // 页面进来收纳账号密码登陆
    saveUnlock(false);

    saveType('account');
  }

  savePasswordRef = (ref) => {
    this.pwRef = ref;
  };

  onChangeType = (type) => {
    const { saveType, saveUnlock } = this.props;
    saveType(type);
    if (type !== 'third') {
      this[`${type}Ref`].current.focus();
    }
    //当tab不是密码登陆时隐藏掉密码登陆
    if (type !== 'account') saveUnlock(false);
  };

  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.pwRef, 'this.pwRef----');
    // 防止chorme密码弹窗覆盖图片验证弹窗
    if (this.pwRef) {
      this.pwRef.blur();
    }

    const { type } = this.props;
    const activeFileds = this.active[type];

    this.formRef.current.validateFields(activeFileds).then((values) => {
      console.log('提交数据的路上...');
      // loginType: username_pwd_login - 用户名密码; mobile_sms_login - 手机验证码
      this.params =
        type === 'account'
          ? {
              loginType: 'username_pwd_login',
              username: values.username,
              password: values.password,
            }
          : {
              loginType: 'mobile_sms_login',
              username: values.mobile,
              password: values.captcha,
            };

      if (type === 'account') {
        this.setState({
          isSlideShow: true,
        });
      } else {
        this.postLogin(this.params);
      }
    });
  };

  onVerifySuccess = (data = {}) => {
    const newParams = {
      ...this.params,
      clientUid: data.clientUid,
      captchaVerification: data.captchaVerification,
    };
    this.postLogin(newParams);
  };

  postLogin = async (data = {}) => {
    const { login } = this.props;

    // 普通登录和绑定登录共用，model利用modalType区分
    const res = await login({
      ...data,
      modalType: 'bind',
      loginTabType: this.props.type, // 记录每次登录的方式
    });
    if (res.success && res.data && res.data.hasChangedPwd) {
      message.success('绑定账号成功');
    }
  };

  getCaptcha = (params = {}) => {
    const { getCaptcha } = this.props;

    return getCaptcha({
      ...params,
      username: this.params && this.params.username,
    });
  };

  verifySlideFixedChild(data) {
    this.setState({
      isSlideShow: data,
    });
  }

  render() {
    const { type, submitLoading } = this.props;
    const { passwordDefault } = this.state;
    return (
      <Fragment>
        <div className="bnq-login-form">
          <Form ref={this.formRef} autoComplete="off">
            <Tabs className="bnq-login-tabs" activeKey={type} onChange={this.onChangeType}>
              <TabPane tab="密码绑定" key="account">
                <Form.Item name="username" rules={[{ required: true, message: '请输入工号或手机号!' }]}>
                  <Input
                    ref={this.accountRef}
                    prefix={<UserOutlined />}
                    // autoComplete="new-password"
                    size="large"
                    bordered={false}
                    placeholder="工号/手机号"
                  />
                </Form.Item>
                <PasswordInput
                  name="password"
                  placeholder="密码"
                  size="large"
                  passwordDefault={passwordDefault}
                  onFocus={() => {
                    if (isMobile) {
                      // fix 移动端点密码时遮住了部分输入框
                      document.getElementById('userContainer').scrollTop = document.getElementById(
                        'userContainer',
                      ).offsetHeight;
                    }
                  }}
                  savepasswordref={this.savePasswordRef}
                  // { validator: this.filterChinese }
                  rules={[{ required: true, message: '请输入密码!' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '')}
                  toggleType={(boolChange) => {
                    this.setState({ passwordDefault: boolChange });
                  }}
                  // onInput={this.filterChinese}
                  autoComplete="off"
                />
              </TabPane>
              <TabPane tab="快捷绑定" key="mobile">
                <Form.Item name="mobile" rules={[{ required: true, message: '请输入手机号!' }]}>
                  <Input
                    ref={this.mobileRef}
                    prefix={<MobileOutlined />}
                    size="large"
                    bordered={false}
                    placeholder="手机号"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码!' }]}>
                  <Captcha
                    form={this.formRef && this.formRef.current}
                    prefix={<KeyOutlined rotate={180} />}
                    bordered={false}
                    target="mobile"
                    queryCaptcha={this.props.querySms}
                    size="large"
                    placeholder="验证码"
                    onFocus={() => {
                      if (isMobile) {
                        // fix 移动端input遮住了部分输入框
                        document.getElementById('userContainer').scrollTop = document.getElementById(
                          'userContainer',
                        ).offsetHeight;
                      }
                    }}
                  />
                </Form.Item>
              </TabPane>
            </Tabs>
            {type === 'third' ? null : (
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.onSubmit}
                  loading={submitLoading || (type === 'account' && this.props.getCaptchaLoading)}
                >
                  登录并绑定已有账号
                </Button>
                {this.state.isSlideShow && (
                  <VerifySlideFixed
                    isSlideShow={this.state.isSlideShow}
                    verifyPointFixedChild={this.verifySlideFixedChild.bind(this)}
                    onOK={this.onVerifySuccess}
                    getCaptcha={this.getCaptcha}
                  />
                )}
              </Form.Item>
            )}
          </Form>
        </div>
      </Fragment>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    login: dispatch.common.login,
    loginAndBind: dispatch.common.loginAndBind,
    querySms: dispatch.common.querySms,
    checkIfBind: dispatch.user.checkIfBind,
    getCaptcha: dispatch.common.getCaptcha,
    saveUnlock: dispatch.common.saveUnlock,
    loginCheck: dispatch.common.loginCheck,
    saveType: dispatch.common.saveType,
  };
};

const mapState = (state) => {
  const common = state.loading.effects.common;
  return {
    type: state.common.type,
    unlock: state.common.unlock,
    status: state.common.status,
    message: state.common.message,
    submitLoading: common.login || common.loginCheck,
    getCaptchaLoading: common.getCaptcha,
  };
};

export default connect(mapState, mapDispatch)(LoginForm);
