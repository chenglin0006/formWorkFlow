/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import _throttle from 'lodash.throttle';
import { aesEncrypt } from './api/ase';

import './index.less';

class VerifySlideFixed extends Component {
  static getDerivedStateFromProps(props) {
    if (!props.isSlideShow) {
      return {
        visible: false,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    // move事件添加节流
    this.move = _throttle(this.move, 30).bind(this);

    // 滑块大小
    this.blockSize = {
      width: '50px',
      height: '50px',
    };
    // 滑动区域宽度
    this.barAreaOffsetWidth = 0;
    // 点击时，鼠标相对于滑块区左边框的距离
    this.mouseStartLeft = 0;

    this.state = {
      visible: this.props.initShow ? true : false, // 是否显示验证窗口
      backImgBase: '', // 验证码背景图片
      blockBackImgBase: '', // 验证滑块的背景图片
      backToken: '', // 后端返回的唯一token值
      startMoveTime: '', // 移动开始的时间
      endMovetime: '', // 移动结束的时间
      secretKey: '', // 后端返回的加密秘钥字段
      captchaType: 'blockPuzzle', // 验证类型
      moveBlockLeft: 0, // 滑块相对位移
      status: false, // 鼠标状态
      isEnd: false, // 是够验证完成
      passFlag: '', // 验证结果
      tipWords: '', // 验证结果提示
      text: '向右滑动完成验证', // 滑动区域提示
    };
  }

  componentDidMount() {
    this.uuid();
    this.getData();

    // 部分安卓浏览器滑动会触发返回，导致和滑块冲突，此处禁用浏览器默认行为;
    window.addEventListener('touchmove', this.preventDefault, { passive: false });
  }

  componentDidUpdate(prevProps) {
    // 取消验证后再验证时触发getData
    if (!prevProps.isSlideShow && this.props.isSlideShow) {
      this.getData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.preventDefault);
  }

  // 初始话 uuid
  uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    // eslint-disable-next-line no-bitwise
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    // eslint-disable-next-line no-multi-assign
    s[8] = s[13] = s[18] = s[23] = '-';

    const slider = `${'slider-'}${s.join('')}`;
    const point = `${'point-'}${s.join('')}`;
    // 判断下是否存在 slider
    if (!localStorage.getItem('slider')) {
      localStorage.setItem('slider', slider);
    }
    if (!localStorage.getItem('point')) {
      localStorage.setItem('point', point);
    }
  }

  // 绑定事件
  bind() {
    window.addEventListener('touchmove', this.move, { passive: false }); // 使用preventDefault时需设置passive: false
    window.addEventListener('mousemove', this.move);
    window.addEventListener('touchend', this.end);
    window.addEventListener('mouseup', this.end);
  }

  // 移除绑定事件
  unbind = () => {
    // 移除已绑定事件
    window.removeEventListener('touchmove', this.move);
    window.removeEventListener('mousemove', this.move);
    window.removeEventListener('touchend', this.end);
    window.removeEventListener('mouseup', this.end);
  };

  getData() {
    const { getCaptcha, onOK } = this.props;

    getCaptcha({
      captchaType: this.state.captchaType,
      clientUid: localStorage.getItem('slider'),
      ts: Date.now(),
    })
      .then((res) => {
        const { code, data } = res;

        if (data && data.captchaEnable) {
          this.setState({
            visible: true,
            backImgBase: res.data.originalImageBase64,
            blockBackImgBase: res.data.jigsawImageBase64,
            backToken: res.data.token,
            secretKey: res.data.secretKey,
          });
        } else if (data && !data.captchaEnable) {
          // 无需验证时，设置isSlideShow为false，并执行成功回调ok()
          this.props.verifyPointFixedChild(false); // props.isSlideShow设置为false
          onOK();
        }

        // 请求次数超限
        if (code === 6201) {
          this.setState({
            backImgBase: null,
            blockBackImgBase: null,
            // iconClass: 'icon-close',
            passFlag: false,
            tipWords: res.repMsg,
          });
          setTimeout(() => {
            this.setState({
              tipWords: '',
            });
          }, 1000);
        }
      })
      .catch((error) => {
        console.error('VerifySlideFixed ~ getData ~ error', error);
        this.props.verifyPointFixedChild(false);
      });
  }

  refresh = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(
      {
        backImgBase: '',
        blockBackImgBase: '',
        moveBlockLeft: '',
        text: '向右滑动完成验证',
        status: false,
        isEnd: false,
      },
      () => {
        this.getData();
      },
    );
  };

  setBarArea = (el) => {
    this.barAreaOffsetWidth = el && el.offsetWidth;
  };

  start = (e = window.event) => {
    e.preventDefault();

    // 验证图片没有时，禁止滑动
    if (!this.state.backImgBase) {
      return;
    }

    let x;
    if (!e.touches) {
      // 兼容PC端
      x = e.clientX;
    } else {
      // 兼容移动端
      x = e.touches[0].pageX;
    }
    this.mouseStartLeft = x;
    this.state.startMoveTime = +new Date(); // 开始滑动的时间
    if (this.state.isEnd === false) {
      this.setState(
        {
          text: '',
          status: true,
        },
        () => {
          this.bind();
        },
      );
      this.text = '';
      e.stopPropagation();
    }
  };

  move = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (this.state.status && this.state.isEnd === false) {
      let x;
      if (!e.touches) {
        // 兼容PC端
        x = e.clientX;
      } else {
        // 兼容移动端
        x = e.touches[0].pageX;
      }

      let mouseMoveDistance = x - this.mouseStartLeft; // 鼠标相对于滑动区域左边框的left值
      if (mouseMoveDistance >= this.barAreaOffsetWidth - parseInt(this.blockSize.width, 10)) {
        mouseMoveDistance = this.barAreaOffsetWidth - parseInt(this.blockSize.width, 10);
      }
      if (mouseMoveDistance <= 0) {
        mouseMoveDistance = 0;
      }
      this.setState({
        moveBlockLeft: mouseMoveDistance,
      });
    }
  };

  end = () => {
    const { checkCaptcha, imgSize, onOK } = this.props;
    this.state.endMovetime = +new Date();
    this.unbind(); // 移除绑定事件

    // 判断是否重合
    if (this.state.status && this.state.isEnd === false) {
      let moveLeftDistance = parseInt(this.state.moveBlockLeft, 10);
      moveLeftDistance = (moveLeftDistance * 310) / parseInt(imgSize.width, 10);
      const data = {
        captchaType: this.state.captchaType,
        pointJson: this.state.secretKey
          ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), this.state.secretKey)
          : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
        token: this.state.backToken,
        clientUid: localStorage.getItem('slider'),
        ts: Date.now(),
      };
      checkCaptcha(data).then((res) => {
        if (res.code === 0) {
          this.state.isEnd = true;
          this.state.passFlag = true;
          this.state.tipWords = this.setState({
            tipWords: `${((this.state.endMovetime - this.state.startMoveTime) / 1000).toFixed(2)}s验证成功`,
          });
          setTimeout(() => {
            if (typeof onOK === 'function') {
              onOK({
                ...res.data,
                captchaVerification: aesEncrypt(
                  `${res.data.token}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`,
                  this.state.secretKey,
                ),
              });
            }

            this.state.tipWords = '';
            this.props.verifyPointFixedChild(false);

            // this.refresh();
          }, 1000);
        } else {
          this.setState({
            isEnd: true,
            passFlag: false,
            tipWords: res.repMsg || '验证失败',
          });
          setTimeout(() => {
            this.refresh();
            this.setState({
              tipWords: '',
            });
          }, 1000);
        }
      });
      this.state.status = false;
    }
  };

  closeBox = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (this.props.closeBox) {
      this.props.closeBox();
    } else {
      this.props.verifyPointFixedChild(false);
    }
  };

  preventDefault = (e) => {
    // 禁用默认事件
    e.preventDefault();
  };

  render() {
    const { vSpace, barSize, transitionLeft, imgSize } = this.props;
    const { visible } = this.state;
    if (this.props.initShow) {
    } else {
      if (!visible) {
        return null;
      }
    }

    console.log(visible, '-----');

    return (
      // 蒙层
      <div className="mask" style={{ display: visible ? 'block' : 'none' }} onMouseMove={this.preventDefault}>
        <div className="verifybox" style={{ maxWidth: `${parseInt(imgSize.width, 10) + 30}px` }}>
          <span className="verifybox-close" onClick={this.closeBox}>
            <i className="iconfont icon-close" />
          </span>
          <div className="verifybox-bottom">
            {/* 验证容器 */}
            <div style={{ position: 'relative' }} className="stop-user-select">
              <div
                className="verify-img-out"
                style={{ width: imgSize.width, height: imgSize.height, marginBottom: vSpace }}
              >
                <div className="verify-img-loading">
                  <div>加载中...</div>
                </div>
                <div className="verify-img-panel">
                  {this.state.backImgBase && (
                    <img
                      src={`data:image/png;base64,${this.state.backImgBase}`}
                      alt=""
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      onMouseDown={this.preventDefault}
                    />
                  )}
                  <div className="verify-refresh" onClick={this.refresh}>
                    <i className="iconfont icon-refresh" />
                  </div>
                  <CSSTransition in={this.state.tipWords.length > 0} timeout={150} classNames="tips" unmountOnExit>
                    <span
                      className={this.state.passFlag ? `${'verify-tips'} ${'suc-bg'}` : `${'verify-tips'} ${'err-bg'}`}
                    >
                      {this.state.tipWords}
                    </span>
                  </CSSTransition>
                </div>
              </div>

              <div
                className="verify-bar-area"
                style={{ width: imgSize.width, height: barSize.height }}
                ref={this.setBarArea}
              >
                <span className="verify-msg">{this.state.text}</span>

                {/* 滑动按钮 */}
                <div
                  className="verify-move-block"
                  onTouchStart={this.start}
                  onMouseDown={this.start}
                  onContextMenu={this.preventDefault}
                  style={{
                    width: barSize.height,
                    height: barSize.height,
                    left: this.state.moveBlockLeft,
                    transition: transitionLeft,
                  }}
                >
                  <i className="verify-move-icon" />

                  {/* 滑块图片 */}
                  {this.state.blockBackImgBase && (
                    <div
                      className="verify-sub-block"
                      style={{
                        width: `${Math.floor((parseInt(imgSize.width, 10) * 47) / 310)}px`,
                        height: imgSize.height,
                        top: `-${parseInt(imgSize.height, 10) + vSpace}px`,
                        backgroundSize: `${imgSize.width} ${imgSize.height}`,
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${this.state.blockBackImgBase}`}
                        alt=""
                        style={{ width: '100%', height: '100%', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

VerifySlideFixed.propTypes = {
  // mode: PropTypes.string,
  // setSize: PropTypes.object,

  vSpace: PropTypes.number,
  imgSize: PropTypes.object,
  barSize: PropTypes.object,
  transitionLeft: PropTypes.object,

  getCaptcha: PropTypes.func.isRequired,
  checkCaptcha: PropTypes.func.isRequired,
  isSlideShow: PropTypes.bool,
  onOK: PropTypes.func,
  verifyPointFixedChild: PropTypes.func,
  closeBox: PropTypes.func,
  initShow: PropTypes.bool,
};

VerifySlideFixed.defaultProps = {
  // mode: 'fixed',
  // 图片与活动条间距
  vSpace: 16,
  // verifybox整个防刷框的宽高，目前只用了width
  imgSize: {
    width: '310px',
    height: '155px',
  },
  // 滑动区域的宽高
  barSize: {
    width: '310px',
    height: '36px',
  },
};

const mapDispatch = (dispatch) => {
  return {
    checkCaptcha: dispatch.common.checkCaptcha,
  };
};

const mapState = () => {
  return {};
};

export default connect(mapState, mapDispatch)(VerifySlideFixed);
