/* 字段id */
import React, { Fragment } from 'react';
import { Input, Form, message } from 'antd';
import PropTypes from 'prop-types';

const RenderUuidProps = ({ changeCardListStore, cardList, form, activeFormItem }) => {
  return (
    <Fragment>
      <Form.Item
        label="字段id"
        name="uuid"
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
              if (ele.uuid === s && activeFormItem.uuid !== ele.uuid) {
                repeatStatus = true;
              } else if (ele.children) {
                ele.children.forEach((c) => {
                  if (c.uuid === s && activeFormItem.uuid !== c.uuid) {
                    repeatStatus = true;
                  }
                });
              }
            });
            if (repeatStatus) {
              message.error('字段id必须唯一');
              form.setFieldsValue({ uuid: activeFormItem.uuid });
            } else {
              changeCardListStore(s, 'uuid');
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
