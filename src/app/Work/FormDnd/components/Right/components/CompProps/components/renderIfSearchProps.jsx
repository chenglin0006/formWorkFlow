/* 是否可搜索 */
import React, { Fragment } from 'react';
import { Form, Switch } from 'antd';
import PropTypes from 'prop-types';

const RenderIfSearchProps = (props) => {
  const { changeCardListStore } = props;
  return (
    <Fragment>
      <Form.Item label="是否可搜索" name="showSearch" valuePropName="checked">
        <Switch
          onChange={(v) => {
            changeCardListStore(v, 'showSearch');
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

RenderIfSearchProps.propTypes = {
  changeCardListStore: PropTypes.func,
};

export default RenderIfSearchProps;
