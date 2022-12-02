/* 字段id */
import React, { Fragment } from 'react';
import { Input, Form, message } from 'antd';
import PropTypes from 'prop-types';

const RenderUuidProps = ({ changeCardListStore, cardList, form, activeFormItem }) => {
  return (
    <Fragment>
      <Form.Item
        label="字段名"
        name="itemParamName"
        rules={[
          {
            required: true,
            message: 'Please input',
          },
        ]}
      >
        <Input
          onBlur={(v) => {
            console.log(v.target.value);
            const s = v.target.value;
            let repeatStatus = false;
            cardList.forEach((ele) => {
              if (ele.itemParamName === s && activeFormItem.itemParamName !== ele.itemParamName) {
                repeatStatus = true;
              } else if (ele.children) {
                ele.children.forEach((c) => {
                  if (c.itemParamName === s && activeFormItem.itemParamName !== c.itemParamName) {
                    repeatStatus = true;
                  }
                });
              }
            });
            if (repeatStatus) {
              message.error('字段参数必须唯一');
              form.setFieldsValue({ itemParamName: activeFormItem.itemParamName });
            } else {
              changeCardListStore(s, 'itemParamName');
            }
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderUuidProps.propTypes = {
  changeCardListStore: PropTypes.func,
  cardList: PropTypes.array,
  form: PropTypes.object,
  activeFormItem: PropTypes.object,
};

export default RenderUuidProps;
