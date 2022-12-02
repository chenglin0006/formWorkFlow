/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Button, Tabs, message, Modal } from 'antd';
import { UserOutlined, MobileOutlined, KeyOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Captcha from '@/components/Inputs/Captcha';
import VerifySlideFixed from '@/components/Verify/VerifySlideFixed';
import { isMobile, isWeixin, isQywx, WX, FS, QYWX, QYWXPC } from '@/util/const';
import { Tools } from '@/util';
import PasswordInput from '@/components/PasswordInput/index';
import urlConfig from 'config/url';
import wxImage from '@/assets/img/wx.png';
import qywxImage from '@/assets/img/qywx.png';
import fsImage from '@/assets/img/fs.png';
import Alert from '@/components/Alert';
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
      loginCheckMsg: {
        third: {},
        mobile: {},
        account: {},
      }, //缓存后端给的信息
      loginCheckFlag: false,
    };
  }
  // type=>  third:一键登录 mobile:免密登陆 account:密码登陆
  componentDidMount() {
    const { showThirdLogin, stayInLogin, saveUnlock, saveType } = this.props;
    // 页面进来收纳账号密码登陆
    saveUnlock(false);
    // 一进来选择免密登陆
    let type = 'mobile';
    // 第三方登录
    if (showThirdLogin) {
      type = 'third';
    }
    // TODO 一下规则0.2版本失效
    // 通过cookie来获取上次登录成功之后的登录方式
    // const cookieLoginTabType = Tools.getCookie('loginTabType');
    // if (cookieLoginTabType) {
    //   type = cookieLoginTabType;
    // }
    if (isQywx) {
      // 企业微信不展示第三方登录，所以企业微信自动登录成功或者失败后回到登录页的时候默认用免密登录
      if (type === 'third') {
        type = 'mobile';
      }
    }
    saveType(type);
    if (stayInLogin) {
      return;
    } else {
      // 企业微信自动登录
      if (isQywx) {
        this.toThirdLoginPage(QYWX);
      }
    }
  }

  toThirdLoginPage = (type) => {
    const redirectUrl = `${location.origin}/thirdLogin?thirdType=${type}`;
    let openUrl = '';
    if (location.origin.indexOf('localhost') > -1) {
      openUrl = `${urlConfig.development.targetUrl}/authnService/thirdLogin/${type}/login?uri=${encodeURIComponent(
        redirectUrl,
      )}`;
    } else {
      openUrl = `${location.origin}/authnService/thirdLogin/${type}/login?uri=${encodeURIComponent(redirectUrl)}`;
    }
    if (type === WX) {
      // eslint-disable-next-line no-undef
      if (window._bnq_trace) {
        window._bnq_trace.push({
          type: 'event',
          eventId: 'wx_login_click',
          eventLabel: '点击微信登录按钮',
        });
      }
    } else if (type === FS) {
      // eslint-disable-next-line no-undef
      if (window._bnq_trace) {
        window._bnq_trace.push({
          type: 'event',
          eventId: 'fs_login_click',
          eventLabel: '点击飞书登录按钮',
        });
      }
    } else if (type === QYWXPC) {
      // eslint-disable-next-line no-undef
      if (window._bnq_trace) {
        window._bnq_trace.push({
          type: 'event',
          eventId: 'fs_login_click',
          eventLabel: '点击企业微信登录按钮',
        });
      }
    } else if (type === QYWX) {
      // eslint-disable-next-line no-undef
      if (window._bnq_trace) {
        window._bnq_trace.push({
          type: 'event',
          eventId: 'fs_login_click',
          eventLabel: '企业微信自动登录',
        });
      }
    }

    window.location.href = openUrl;
  };

  // 手机版：如果在微信游览器，不展示快捷登录按钮。其他游览器只展示飞书登录按钮，点击直接授权登录。
  // PC设备（ipad同pc处理）：企业微信，飞书，微信按钮都展示，点击展示扫码页面
  renderThirdPage = () => {
    if (isMobile) {
      if (isWeixin) {
        return null;
      }
      return (
        <div className={`third-login-container ${isMobile ? 'mobile' : ''}`}>
          <div
            className="third-div"
            onClick={() => {
              this.toThirdLoginPage(FS);
            }}
          >
            <div>
              <img src={fsImage} alt="" />
            </div>
            <div className="third-title">飞书快捷登录</div>
          </div>
        </div>
      );
    }

    return (
      <div className="third-login-container">
        <div
          className="third-div"
          onClick={() => {
            this.toThirdLoginPage(QYWXPC);
          }}
        >
          <div>
            <img className="qywx-img" src={qywxImage} alt="" />
          </div>
          <div className="third-title">百安居企微</div>
        </div>
        <div
          className="third-div"
          onClick={() => {
            this.toThirdLoginPage(WX);
          }}
        >
          <div>
            <img className="wx-img" src={wxImage} alt="" />
          </div>
          <div className="third-title">微信扫码登录</div>
        </div>
        <div
          className="third-div"
          onClick={() => {
            this.toThirdLoginPage(FS);
          }}
        >
          <div>
            <img className="fs-img" src={fsImage} alt="" />
          </div>
          <div className="third-title">飞书快捷登录</div>
        </div>
      </div>
    );
  };

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

    this.formRef.current.validateFields(activeFileds).then(async (values) => {
      let flag = true;
      if (!this.state.loginCheckFlag) {
        flag = await this.handleBlur(type === 'account' ? values.username : values.mobile);
        if (!flag) return false;
      }
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

    const res = await login({
      ...data,
      modalType: 'login',
      loginTabType: this.props.type, // 记录每次登录的方式
    });

    if (!res.success) {
      if (res.code === 402) {
        Modal.confirm({
          icon: <ExclamationCircleOutlined />,
          content: res.message,
          okText: '找回密码',
          cancelText: '取消',
          onOk: () => {
            this.props.history.push('/user/forget-password');
          },
        });
      } else {
        message.error(`${res.message}`);
      }
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
  //  18153527742
  handleBlur = async (value) => {
    const { loginCheck, type } = this.props;
    const username = value.trim();
    if (!username) return false;

    try {
      const params = {
        username,
        deptPoolId: 2,
        loginType: type === 'account' ? 'username_pwd_login' : 'mobile_sms_login',
      };
      const res = await loginCheck(params);
      if (res.code === 0) {
        const { data = {} } = res;

        this.setState({
          loginCheckFlag: data?.flag,
          loginCheckMsg: { ...this.state.loginCheckMsg, [type]: data },
        });

        // const msg = (type) =>
        //   message[type]({
        //     duration: 5,
        //     content: data?.message,
        //     style: {
        //       marginTop: isMobile ? '26vh' : '',
        //     },
        //   });
        // msg(data?.flag ? 'success' : 'error');
      } else message.error(res?.message || '未知错误');
      return res?.data?.flag || false;
    } catch (error) {
      message.error(error);
      return false;
    }
  };

  // filterChinese = (rules, value, callback) => {
  //   console.log(value)
  //   const regExp = (/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g)
  //   if (regExp.test(value)) {
  //     value = value.replace(regExp, '')
  //     this.formRef.current.setFieldsValue({ password: value })
  //     callback(new Error('密码错误'))
  //   }

  //   return callback();
  // };
  clearMsg = () => {
    const { type } = this.props;
    this.setState({
      loginCheckMsg: { ...this.state.loginCheckMsg, [type]: { falg: false, message: '' } },
    });
  };
  alertCpn = () => {
    const { loginCheckMsg } = this.state;
    const { type } = this.props;
    const { flag = false, message = '' } = loginCheckMsg[type];
    return (
      message && (
        <Alert
          showIcon
          duration={5}
          clearMsg={this.clearMsg}
          message={<div className="three-lines-omitted">{message}</div>}
          type={flag ? 'success' : 'error'}
        />
      )
    );
  };
  render() {
    const { type, unlock, submitLoading, showThirdLogin } = this.props;
    const { passwordDefault } = this.state;
    return (
      <Fragment>
        <div className="bnq-login-form">
          <Form ref={this.formRef} autoComplete="off">
            {/* {message && <Alert style={{ marginBottom: 24 }} message={message} type="error" showIcon />} */}

            <Tabs className="bnq-login-tabs" activeKey={type} onChange={this.onChangeType}>
              {showThirdLogin ? (
                <TabPane tab="一键登录" key="third">
                  {this.renderThirdPage()}
                </TabPane>
              ) : null}

              <TabPane tab="免密登录" key="mobile">
                {this.alertCpn()}
                <Form.Item name="mobile" rules={[{ required: true, message: '请输入手机号!' }]}>
                  <Input
                    ref={this.mobileRef}
                    prefix={<MobileOutlined />}
                    size="large"
                    bordered={false}
                    placeholder="手机号"
                    onBlur={(e) => this.handleBlur(e.target.value)}
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

              {unlock && (
                <TabPane tab="密码登录" key="account">
                  {this.alertCpn()}
                  <Form.Item name="username" rules={[{ required: true, message: '请输入工号或手机号!' }]}>
                    <Input
                      ref={this.accountRef}
                      prefix={<UserOutlined />}
                      // autoComplete="new-password"
                      size="large"
                      bordered={false}
                      placeholder="工号/手机号"
                      onBlur={(e) => this.handleBlur(e.target.value)}
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
              )}
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
                  登录
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
