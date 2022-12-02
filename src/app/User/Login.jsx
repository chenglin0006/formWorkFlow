/* eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isMobile, isWeixin, isFeishu, isQywx } from '@/util/const';
import { getPageQuery } from '@/util/common';
import urlConfig from 'config/url';
import { getAuthority } from '@/util/authority';
import { Tools } from '@/util';
import LoginForm from './LoginForm';
import { parse, stringify } from 'qs';

import './index.less';

class Login extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { redirect } = getPageQuery();
    if (redirect) {
      localStorage.setItem('redirectUrl', redirect);
    } else {
      localStorage.setItem('redirectUrl', '');
    }
  }

  render() {
    const { stayInLogin } = getPageQuery();
    let showThirdLogin = true;
    if (isMobile && isWeixin) {
      showThirdLogin = false;
    }
    const showPasswordLogin = localStorage.getItem('showPasswordLogin');
    return (
      <div className="bng-login-container">
        <LoginForm showThirdLogin={showThirdLogin} history={this.props.history} stayInLogin={stayInLogin} />
        {showPasswordLogin ? (
          <div className="third-login-div">
            <Link className="login-form-forgot" to="/user/forget-password">
              忘记密码
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    login: dispatch.common.login,
    querySms: dispatch.common.querySms,
  };
};

const mapState = (state) => {
  return {
    status: state.common.status,
    message: state.common.message,
    submitLoading: state.loading.effects.common.login,
  };
};

export default connect(mapState, mapDispatch)(Login);
