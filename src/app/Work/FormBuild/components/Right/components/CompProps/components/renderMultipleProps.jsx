/* 是否多选 */
import React, { Fragment, useMemo } from 'react';
import { Form, Switch } from 'antd';
import PropTypes from 'prop-types';

const RenderMultipleProps = ({ changeCardListStore, setIsMultiple, activeFormItem }) => {
  const label = useMemo(() => {
    return activeFormItem.type === 'upload' || activeFormItem.type === 'uploadPic'
      ? '是否允许一次选中多个'
      : '是否多选';
  }, [activeFormItem]);

  return (
    <Fragment>
      <Form.Item label={label} name="multiple" valuePropName="checked">
        <Switch
          onChange={(v) => {
            console.log(v);
            setIsMultiple(v);
            changeCardListStore(v, 'multiple');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderMultipleProps.propTypes = {
  changeCardListStore: PropTypes.func,
  setIsMultiple: PropTypes.func,
  activeFormItem: PropTypes.object,
};

export default RenderMultipleProps;
