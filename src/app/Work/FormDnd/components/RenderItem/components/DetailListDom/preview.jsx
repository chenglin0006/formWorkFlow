/* eslint-disable import/no-cycle */
import React, { Fragment, useState, useEffect } from 'react';
import { Form, Table, Divider, Button } from 'antd';
import { Tools } from '@/util';
import PropTypes from 'prop-types';
import { renderFormItem } from '../../renderItem';

const Index = (props) => {
  const { element, form } = props;
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const o = {};
    o[element.uuid] = [...listData];
    form.setFieldsValue(o);
  }, [listData]);

  const copyDetailFun = (r) => {
    const v = form.getFieldValue(element.uuid);
    let obj = {};
    v.forEach((ele) => {
      if (ele.id === r.id) {
        obj = { ...ele };
      }
    });
    obj.id = Tools.uuid();
    v.push(obj);
    setListData(v);
  };

  const deleteDetailFun = (d) => {
    const f = form.getFieldValue(element.uuid);
    console.log(f);
    const l = f.filter((i) => {
      return i.id !== d.id;
    });
    setListData(l);
  };

  const addFun = () => {
    const l = [...listData];
    l.push({ id: Tools.uuid() });
    setListData(l);
  };

  const columns = [];
  let width = 120;
  const itemList = [];
  element.children.forEach((ele) => {
    const obj = {
      key: ele.uuid,
      title: ele.name,
      dataIndex: ele.uuid,
      width: 120,
      render: (_, r, index) => {
        return <Form.Item name={[element.uuid, index, ele.uuid]}>{renderFormItem(ele)}</Form.Item>;
      },
    };
    width += 120;
    columns.push(obj);
    itemList.push(obj);
  });
  columns.push({
    key: 'manu',
    title: '操作',
    width: 120,
    dataIndex: 'manu',
    render: (_, r) => {
      return (
        <Fragment>
          <a onClick={() => copyDetailFun(r)}>复制</a>
          <Divider type="vertical" />
          <a onClick={() => deleteDetailFun(r)}>删除</a>
        </Fragment>
      );
    },
  });
  return (
    <Fragment>
      <Form.Item name={element.uuid} valuePropName="dataSource">
        <Table bordered columns={columns} pagination={false} scroll={{ x: width }} />
      </Form.Item>
      <div>
        <Button onClick={addFun}>添加明细</Button>
      </div>
    </Fragment>
  );
};

Index.propTypes = {
  element: PropTypes.object,
  form: PropTypes.object,
};

export default Index;
