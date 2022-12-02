import React, { Fragment, useState } from 'react';
import { Upload, Button, message, Modal } from 'antd';
import { connect } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './index.less';

const Index = (props) => {
  const { element, uploadFile, getFileByFileId, fileType = 'file', uploadType } = props;
  const [fileData, setFileData] = useState([]);
  console.log('elementupload', element);

  const triggerChange = (changedValue) => {
    const l = [...fileData];
    l.push(changedValue);
    setFileData(l);
  };

  const beforeUpload = (file) => {
    const { maxSize } = element;
    if (maxSize) {
      if (file.size / 1024 / 1024 > maxSize) {
        message.error(`图片大小不能超过${maxSize}M，请重新上传！`);
        // throw new TypeError(`图片尺寸不能超过${max}，请重新上传！`);
        return Promise.reject(`图片尺寸不能超过${maxSize}M，请重新上传！`);
      }
    }
    return true;
  };

  const uploadByApi = (e) => {
    const { file } = e;
    if (element.maxNumber && fileData.length >= element.maxNumber) {
      return;
    }
    uploadFile({ file, bucket: 'bajanju-p', fileType }).then((res) => {
      getFileByFileId({ fileId: res.fid, bucket: 'bajanju-p' }).then((fileRes) => {
        const newFile = {
          id: fileRes.fileId,
          thumbUrl: fileRes.fileUrl,
          url: fileRes.fileUrl,
          name: file.name,
          status: 'done',
        };
        triggerChange(newFile);
      });
    });
  };

  let uploadProps = {
    name: 'file',
    accept: element.accept,
    customRequest: uploadByApi,
    beforeUpload,
    fileList: fileData,
    listType: element.listType || 'text',
    multiple: element.multiple,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      } else if (info.file.status === 'removed') {
        const a = fileData.filter((ele) => {
          return ele.id !== info.file.id;
        });
        setFileData(a);
      }
    },
  };

  if (uploadType === 'pic') {
    uploadProps = {
      ...uploadProps,
      onPreview: (file) => {
        console.log(file);
        Modal.info({
          className: 'preview-pic-modal',
          title: file.name,
          width: 500,
          content: <img className="preview-img" src={file.url} alt="" />,
        });
      },
    };
  }

  const uploadBtn =
    element.listType === 'picture-card' || uploadType === 'pic' ? (
      <div className="picture-card-desc-div">
        <div>
          <UploadOutlined />
        </div>
        <div>{element.uploadText}</div>
      </div>
    ) : (
      <Button icon={<UploadOutlined />}>{element.uploadText}</Button>
    );
  return (
    <Fragment>
      <Upload {...uploadProps}>{element.maxNumber && fileData.length >= element.maxNumber ? null : uploadBtn}</Upload>
      <div className="upload-desc-div">
        {element.maxSize ? `请上传文件不超过${element.maxSize}m; ` : ''}
        {element.maxNumber ? `最多上传${element.maxNumber}个文件` : ''}
      </div>
    </Fragment>
  );
};

Index.propTypes = {
  element: PropTypes.object,
  uploadFile: PropTypes.func,
  renderType: PropTypes.string,
  fileType: PropTypes.string,
  getFileByFileId: PropTypes.func,
  uploadType: PropTypes.string,
};

const mapDispatch = (dispatch) => {
  return {
    uploadFile: dispatch.common.uploadFile,
    getFileByFileId: dispatch.common.getFileByFileId,
  };
};

export default connect(null, mapDispatch)(Index);
