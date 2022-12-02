/* eslint-disable */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Spin } from 'antd';
import wxImage from '@/assets/img/wx.png';
import fsImage from '@/assets/img/fs.png';
import zmImage from '@/assets/img/zhima.png';
import qywxImage from '@/assets/img/qywx.png';
import arrowExchangeImage from '@/assets/img/arrowExchange.png';
import GlobalFooter from '@/components/GlobalFooter';
import { Tools } from '@/util';
import BindForm from '@/app/User/BindForm';
import message from '@/components/message';
import logo from '@/assets/img/logo.png';
import { getQueryPath } from '@/util/common';
import { WX, QYWX, QYWXPC } from '@/util/const';

import './bind.less';

const thirdMap = {
  wechat: '微信',
  feishu: '飞书',
  qywx: '企业微信',
};

class Bind extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    checkIfBind: PropTypes.func.isRequired,
    checkIfBindLoading: PropTypes.bool,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      thirdType: Tools.getUrlArg('thirdType') || '', // 是否是从第三方登录
      showBindModal: false,
    };
  }

  componentDidMount() {
    const { thirdType } = this.state;
    if (thirdType) {
      this.checkIfBindFun();
    }
  }

  // eslint-disable-next-line consistent-return
  checkIfBindFun = async () => {
    const { checkIfBind, history } = this.props;
    const respData = await checkIfBind();
    if (respData.success) {
      const { res, hasChangedPwd } = respData.data;
      if (res === 0) {
        Tools.setCookie('loginTabType', 'third', '/');
        if (hasChangedPwd) {
          // eslint-disable-next-line no-undef
          if (window._bnq_trace) {
            window._bnq_trace.push({
              type: 'event',
              eventId: 'login_success',
              eventLabel: '登录成功',
            });
          }
          Tools.loginRedirect();
        } else {
          Modal.confirm({
            className: 'bnq-info-modal',
            title: '首次登录时需要修改密码',
            okText: '去修改',
            cancelButtonProps: { style: { display: 'none' } },
            onOk() {
              history.push('/user/update-password');
            },
          });
        }
      } else {
        this.setState({ showBindModal: true });
      }
    } else {
      message.error(respData.message);
      setTimeout(() => {
        let redirect = '';
        if (localStorage.getItem('redirectUrl')) {
          redirect = localStorage.getItem('redirectUrl');
          const nextUrl = getQueryPath('/user/login', {
            redirect,
            stayInLogin: true,
          });
          history.push(nextUrl);
        } else {
          history.push('/user/login?stayInLogin=true');
        }
      }, 1000);
    }
  };

  render() {
    const { showBindModal, thirdType } = this.state;
    const { checkIfBindLoading } = this.props;

    return (
      <Spin spinning={checkIfBindLoading}>
        <div style={{ minHeight: '100vh' }}>
          {showBindModal && (
            <div className="bng-bind-container">
              <div className="header">
                <Link to="/user/login?stayInLogin=true">
                  <img alt="logo" className="logo" src={logo} />
                  {/* <span className={styles.title}>{projectName}</span> */}
                </Link>
              </div>
              <div className="bind-div">
                <div className="title">继续以完成第三方帐号绑定</div>
                <div className="bind-imgs">
                  <img alt="" src={zmImage} />
                  <img className="exchange" alt="" src={arrowExchangeImage} />
                  <img
                    alt=""
                    src={thirdType === WX ? wxImage : thirdType === QYWX || thirdType === QYWXPC ? qywxImage : fsImage}
                  />
                </div>
                <div className="bind-tips">你已通过 {thirdMap[thirdType]} 授权，完善以下登录信息即可完成绑定</div>
                <BindForm history={this.props.history} />
              </div>
              <GlobalFooter copyright="百安居中国" />
            </div>
          )}
        </div>
      </Spin>
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
    checkIfBindLoading: state.loading.effects.common.checkIfBind,
  };
};

export default connect(mapState, mapDispatch)(Bind);
