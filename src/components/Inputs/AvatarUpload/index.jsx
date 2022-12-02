/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Upload, message, Button, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import Qiniu from '@/util/Qiniu';
import { connect } from 'react-redux';
import { getImgInfo } from '@/util/common';

import './index.less';

class UploadImage extends Component {
  static propTypes = {
    className: PropTypes.string, // 可以定制样式
    disabled: PropTypes.bool, // 是否可点
    uploadLoading: PropTypes.bool, // 是否可点
    max: PropTypes.string, // 限制图片的最大宽高，格式为"maxWidth*maxHeight", 不限制某项设置为0
    min: PropTypes.string, // 限制图片的最小宽高，格式为"minWidth*minHeight", 不限制某项设置为0
    size: PropTypes.string, // 限制图片的宽高，格式为"width*height"
    ratio: PropTypes.object, // 限制图片宽高比，{min: 0.95，max: 1.05}, 若固定比例，min和max设置相同值
    beforeUpload: PropTypes.func, // 上传前的自定义方法，可限制上传文件大小，格式等
    value: PropTypes.object,
    maxSize: PropTypes.number,
    onChange: PropTypes.func,
    uploadFile: PropTypes.func,
    getFileByFileId: PropTypes.func,
    fileType: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    max: '',
    min: '',
    size: '',
    maxSize: '',
    ratio: {},
    beforeUpload: undefined,
    uploadFile: {},
    getFileByFileId: {},
    onChange: undefined,
    fileType: 'img',
    uploadLoading: false,
  };

  constructor(props) {
    super(props);
    const { value } = this.props;

    this.state = {
      file: value || {},
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

  beforeUpload = async (file) => {
    const { beforeUpload, max = '', min = '', size = '', ratio = {}, maxSize } = this.props;

    if (beforeUpload) {
      const propsRes = await beforeUpload(file);

      if (!propsRes) {
        return Promise.reject();
      }
    }

    if (maxSize) {
      this.validPicture(file);
      if (file.size > maxSize * 1024 * 1024) {
        message.error(`图片尺寸不能超过${maxSize}M，请重新上传！`);
        // throw new TypeError(`图片尺寸不能超过${max}，请重新上传！`);
        return Promise.reject(`图片尺寸不能超过${maxSize}M，请重新上传！`);
      }
    }

    if (max) {
      this.validPicture(file);

      const { width, height } = await getImgInfo(file);
      const [maxWidth, maxHeight] = max.split('*');

      if ((maxWidth && width > maxWidth) || (maxHeight && height > maxHeight)) {
        message.error(`图片尺寸不能超过${max}，请重新上传！`);
        // throw new TypeError(`图片尺寸不能超过${max}，请重新上传！`);
        return Promise.reject(`图片尺寸不能超过${max}，请重新上传！`);
      }
    }

    if (min) {
      this.validPicture(file);

      const { width, height } = await getImgInfo(file);
      const [minWidth, minHeight] = min.split('*');

      if ((minWidth && width < minWidth) || (minHeight && height < minHeight)) {
        message.error(`图片尺寸不能小于${min}，请重新上传！`);
        // throw new TypeError(`图片尺寸不能小于${min}，请重新上传！`);
        return Promise.reject(`图片尺寸不能小于${min}，请重新上传！`);
      }
    }

    if (size) {
      this.validPicture(file);

      const { width, height } = await getImgInfo(file);
      let [sWidth, sHeight] = size.split('*');
      sWidth = parseInt(sWidth, 10);
      sHeight = parseInt(sHeight, 10);

      if ((sWidth && width !== sWidth) || (sHeight && height !== sHeight)) {
        let errMsg;
        if (sWidth && sHeight) {
          errMsg = `图片尺寸应该为${size}，请重新上传！`;
        } else if (sWidth) {
          errMsg = `图片宽度应该为${sWidth}，请重新上传！`;
        } else if (sHeight) {
          errMsg = `图片高度应该为${sHeight}，请重新上传！`;
        }

        message.error(errMsg);
        // throw new TypeError(errMsg);
        return Promise.reject(errMsg);
      }
    }

    if (ratio.min || ratio.max) {
      this.validPicture(file);

      const { width, height } = await getImgInfo(file);
      const curRatio = width / height;

      if (ratio.min && curRatio < ratio.min) {
        message.error(`图片宽高比例不能小于${ratio.min}，请重新上传！`);
        return Promise.reject(`图片宽高比例不能小于${ratio.min}，请重新上传！`);
      }
      if (ratio.max && curRatio > ratio.max) {
        message.error(`图片宽高比例不能超过${ratio.max}，请重新上传！`);
        return Promise.reject(`图片宽高比例不能超过${ratio.max}，请重新上传！`);
      }
      if (ratio.min === ratio.max && curRatio !== ratio.min) {
        message.error(`图片宽高比例应该为${ratio.min}，请重新上传！`);
        return Promise.reject(`图片宽高比例应该为${ratio.min}，请重新上传！`);
      }
    }

    return true;
  };

  validPicture = (file) => {
    const isPicture = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';

    if (!isPicture) {
      message.error(`图片格式仅支持png/jpeg/jpg！`);
      return Promise.reject();
    }

    return null;
  };

  onProgress = (obj) => {
    const newFile = {
      ...obj,
      status: 'uploading',
      percent: parseInt(obj.percent, 10),
    };

    this.triggerChange(newFile);
  };

  onError = (obj) => {
    const newFile = {
      ...obj,
      status: 'error',
    };

    this.triggerChange(newFile);
  };

  onSuccess = (res) => {
    const { response } = res;

    const newFile = {
      ...res,
      percent: 100,
      status: 'done', // 状态有：uploading done error removed
      response,
      thumbUrl: response.url,
      url: response.url,
    };

    this.triggerChange(newFile);
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

  // 根据后端接口获取图片链接
  uploadByApi = (e) => {
    const { file } = e;
    const { uploadFile, getFileByFileId, fileType = 'img' } = this.props;
    uploadFile({ file, bucket: 'bajanju-p', fileType }).then((res) => {
      getFileByFileId({ fileId: res.fid, bucket: 'bajanju-p' }).then((img) => {
        const newFile = {
          thumbUrl: img.fileUrl,
          url: img.fileUrl,
        };
        this.triggerChange(newFile);
      });
    });
  };

  render() {
    //  onChange, value勿传入下方的Upload组件
    const { className, disabled, onChange, value: noUse, uploadLoading, ...props } = this.props;
    const { file = {} } = this.state;
    const { uploadByQiniu } = Qiniu;

    return (
      <Spin spinning={uploadLoading}>
        <div className="bnq-avatar-upload-wrap">
          <div className="bnq-avatar-wrap">
            <div className="bnq-avatar">
              {!!file.url && <img src={file.url} alt="avatar" />}
              {/* <div className="bnq-avatar-mask">123</div> */}
            </div>
          </div>
          <Upload
            {...props}
            disabled={disabled}
            className="bnq-avatar-upload"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            // customRequest的上传状态回调
            onProgress={this.onProgress}
            onSuccess={this.onSuccess}
            onError={this.onError}
            // 使用后端api uploadByApi上传 或者 使用七牛api自定义上传方法uploadByQiniu
            customRequest={this.uploadByApi}
          >
            <div className="bnq-select-button">
              <Button icon={<UploadOutlined />} disabled={disabled} loading={file.status === 'uploading'}>
                选择图片
              </Button>
            </div>
          </Upload>
        </div>
      </Spin>
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

export default connect(mapState, mapDispatch)(UploadImage);
