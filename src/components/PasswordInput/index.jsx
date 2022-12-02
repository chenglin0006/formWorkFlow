/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './index.less';
import './font.less';

class PasswordInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    classStr: PropTypes.string,
    size: PropTypes.string,
    passwordDefault: PropTypes.bool,
    bordered: PropTypes.bool,
    prefixShow: PropTypes.bool,
    changeByOwn: PropTypes.bool, // 一般页面上只有一个密码框时默认true=》只能自己触发，如果有多个的话可以是其他密码框触发
    savepasswordref: PropTypes.func,
    toggleType: PropTypes.func,
  };

  static defaultProps = {
    name: 'password',
    classStr: '',
    size: '',
    label: '',
    placeholder: '',
    passwordDefault: true,
    changeByOwn: true,
    prefixShow: true,
    bordered: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isFox: true,
    };
  }

  componentDidMount() {
    if (!this.props?.passwordDefault) {
      this.setState({ isFox: false });
    }
    //   const { input } = this.pwref;
    //   const style = window.getComputedStyle(input);
    //   this.setState({ isFox: style.webkitTextSecurity });
  }

  componentDidUpdate(preProps) {
    // fix 每次切换密码时input总是focus到前面，只有blur()后重新focus的时候才会到后面
    // 只有当passwordDefault改变并且是自己触发的密码变更才能执行blur和focus，否则页面中出现多个input密码框时，每个密码框都执行focus鼠标会focus在最后一个input上
    if (this.pwref && this.props.changeByOwn && preProps.passwordDefault !== this.props.passwordDefault) {
      this.pwref.blur();
      this.pwref.focus();
    }
  }

  savePasswordRef = (ref) => {
    this.pwref = ref;
    if (this.props.savepasswordref) {
      this.props.savepasswordref(ref);
    }
  };

  render() {
    const {
      passwordDefault,
      name,
      placeholder,
      label,
      bordered,
      prefixShow,
      size,
      classStr,
      savepasswordref,
      toggleType,
      changeByOwn,
      getValueFromEvent,
      ...rest
    } = this.props;
    const { isFox } = this.state;
    return (
      <Fragment>
        <div className={`form-item ${classStr}`}>
          <Form.Item name={name} label={label} getValueFromEvent={getValueFromEvent} {...rest}>
            <Input
              {...rest}
              ref={this.savePasswordRef}
              // type={passwordDefault ? '' : ''}
              prefix={prefixShow ? <LockOutlined /> : null}
              bordered={bordered}
              size={size}
              // form-item-input_password
              className={isFox ? 'login-form_password' : ''}
              placeholder={placeholder}
              // autoComplete="new-password"
              suffix={
                <span
                  className="toggles"
                  onClick={() => {
                    this.setState({ isFox: !isFox });
                    if (toggleType) {
                      toggleType(!passwordDefault);
                    }
                  }}
                >
                  {isFox ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              }
            />
          </Form.Item>
        </div>
      </Fragment>
    );
  }
}

export default PasswordInput;
