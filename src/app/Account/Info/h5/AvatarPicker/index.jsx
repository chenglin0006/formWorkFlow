import React, { Component } from 'react';
import { List, ActivityIndicator, Modal } from 'antd-mobile';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import './index.less';
import message from '@/components/message';

class AvatarPicker extends Component {
  static propTypes = {
    className: PropTypes.string, // 可以定制样式
    children: PropTypes.node, // 子元素
    initialValue: PropTypes.object, // 初始的图片
    value: PropTypes.object,
    onChange: PropTypes.func,
    uploadFile: PropTypes.func,
    getFileByFileId: PropTypes.func,
    fileType: PropTypes.string,
    uploadLoading: PropTypes.bool,
    maxSize: PropTypes.number,
  };

  constructor(props) {
    super(props);
    const { initialValue, value } = this.props;

    this.state = {
      file: value || initialValue || {}, // 初始化时，value优先级比initialValue高
      currentFile: {},
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        file: nextProps.value || {},
      };
    }
    return null;
  }

  getInputRef = (ref) => {
    this.inputRef = ref;
  };

  clearInput = () => {
    this.inputRef.value = '';
  };

  onClick = () => {
    this.inputRef.click();
  };

  isImage = (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';

    if (!isImage) {
      Modal.alert('图片格式仅支持png/jpeg/jpg！', null, [{ text: '好的' }]);
      return false;
    }

    return true;
  };

  onChange = (e) => {
    const { files } = e.target;

    const { maxSize } = this.props;

    if (files && files[0]) {
      const file = files[0];

      if (!this.isImage(file)) {
        return;
      }

      if (maxSize && file.size > maxSize * 1024 * 1024) {
        message.error(`图片尺寸不能大于${maxSize}M，请重新上传！`);
        return;
      }

      const { uploadFile, getFileByFileId, fileType = 'img' } = this.props;
      uploadFile({ file, fileType }).then((res) => {
        getFileByFileId({ fileId: res.fid }).then((img) => {
          const newFile = {
            thumbUrl: img.fileUrl,
            url: img.fileUrl,
          };
          this.setState({ currentFile: newFile }, () => {
            this.showConfirm();
          });
        });
      });

      // 清空所选图片
      this.clearInput();
    }
  };

  showConfirm = () => {
    const { currentFile = {} } = this.state;
    const { url } = currentFile;
    const ImgDom = url && <img src={url} alt="avatar" style={{ width: '150px', height: '150px' }} />;

    Modal.alert('修改头像', ImgDom, [
      { text: '取消' },
      {
        text: '确认',
        onPress: () => {
          this.triggerChange(currentFile);
        },
      },
    ]);
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;

    if (!('value' in this.props)) {
      this.setState({ file: changedValue });
    }

    if (typeof onChange === 'function') {
      onChange(changedValue);
    }
  };

  render() {
    const { className, children, uploadLoading } = this.props;
    const { file = {} } = this.state;
    const { url } = file;

    const extra = (
      <div className="bnq-avatar-wrap">
        {url && <img src={url} alt="avatar" />}
        <input ref={this.getInputRef} type="file" accept="image/*" onChange={this.onChange} />
      </div>
    );

    const itemClx = classNames('bnq-avatar-picker', className);

    return (
      <>
        <List.Item className={itemClx} extra={extra} arrow="horizontal" onClick={this.onClick}>
          {children}
        </List.Item>
        <ActivityIndicator toast text="上传中..." animating={uploadLoading} />
      </>
    );
  }
}

const mapState = (state) => {
  return {
    uploadLoading: state.loading.effects.common.uploadFile || state.loading.effects.common.getFileByFileId,
  };
};

const mapDispatch = (dispatch) => {
  return {
    uploadFile: dispatch.common.uploadFile,
    getFileByFileId: dispatch.common.getFileByFileId,
  };
};

export default connect(mapState, mapDispatch)(AvatarPicker);
