/* 选项类型 动态还是静态 */
import React, { Fragment } from 'react';
import { Form, Radio } from 'antd';
import PropTypes from 'prop-types';

const RenderSelectTypeProps = ({ setSelectType, changeCardListStore }) => {
  return (
    <Fragment>
      <Form.Item label="选项类型" name="selectType">
        <Radio.Group
          onChange={(v) => {
            setSelectType(v.target.value);
            changeCardListStore(v.target.value, 'selectType');
          }}
        >
          <Radio.Button value={1}>静态数据</Radio.Button>
          <Radio.Button value={2}>动态数据</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </Fragment>
  );
};

RenderSelectTypeProps.propTypes = {
  changeCardListStore: PropTypes.func,
  setSelectType: PropTypes.func,
};

export default RenderSelectTypeProps;
