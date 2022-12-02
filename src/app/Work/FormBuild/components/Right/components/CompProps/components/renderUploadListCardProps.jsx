/* 上传组件要展示的属性 */
import React, { Fragment } from 'react';
import { Select, Input, Form, InputNumber } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const fileTypeEnum = [
  { name: '图片', code: 'image/*' },
  { name: '视频', code: 'video/*' },
  { name: '音频', code: 'audio/*' },
  { name: 'excel', code: '.xls,.xlsx' },
  { name: 'word', code: '.doc,.docx' },
  { name: 'pdf', code: '.pdf' },
  { name: 'txt', code: '.txt' },
];

const RenderUploadListCardProps = ({ changeCardListStore, uploadType }) => {
  return (
    <Fragment>
      {/* {uploadType === 'pic' ? null : (
        <Form.Item label="列表类型" name="listType">
          <Radio.Group
            onChange={(v) => {
              changeCardListStore(v.target.value, 'listType');
            }}
          >
            <Radio.Button value="text">text</Radio.Button>
            <Radio.Button value="picture">picture</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )} */}

      <Form.Item label="按钮文案" name="uploadText">
        <Input
          onChange={(v) => {
            changeCardListStore(v.target.value, 'uploadText');
          }}
        />
      </Form.Item>
      {uploadType === 'pic' ? null : (
        <Form.Item label="文件类型" name="accept">
          <Select
            mode="multiple"
            onChange={(v) => {
              changeCardListStore(v, 'accept');
            }}
          >
            {fileTypeEnum.map((ele) => {
              return (
                <Option key={ele.code} value={ele.code}>
                  {ele.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      )}

      <Form.Item label="文件大小限制" name="maxSize">
        <InputNumber
          min={1}
          addonAfter="m"
          onChange={(v) => {
            changeCardListStore(v, 'maxSize');
          }}
        />
      </Form.Item>
      <Form.Item label="文件个数限制" name="maxNumber">
        <InputNumber
          min={1}
          addonAfter="个"
          onChange={(v) => {
            changeCardListStore(v, 'maxNumber');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderUploadListCardProps.propTypes = {
  changeCardListStore: PropTypes.func,
  uploadType: PropTypes.string,
};

export default RenderUploadListCardProps;
