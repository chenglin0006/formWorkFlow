/*eslint-disable */
import React, { useEffect, useState, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popconfirm, Form, Row, Col, Button, Input, Select, Table } from 'antd';
import './index.less';

const { Option } = Select;

class AppEdit extends Component {
  formRef = React.createRef();
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      usedArray: [],
      arryCategoryList: [],
    };
  }

  componentDidMount() {
    const { getApps, apps } = this.props;
    getApps().then((res) => {
      this.setState({ usedArray: res.bindArray || [], arryCategoryList: res.bindArray || [] });
    });
  }

  deleteItem = (item) => {
    const { usedArray } = this.state;
    usedArray.forEach((ele, index) => {
      if (ele.appId === item.appId) {
        usedArray.splice(index, 1);
      }
    });
    this.setState({ usedArray });
  };

  onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  render() {
    const { usedArray, arryCategoryList } = this.state;
    const { removeUseApps, addUseApps, getApps } = this.props;
    const gutter = 24;
    const span = 8;
    const columns = [
      {
        title: '应用名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '应用状态',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '操作',
        dataIndex: 'address',
        render: (_, record) => {
          let text = record.appid ? '移除' : '添加';
          return (
            <span>
              <Popconfirm
                title={`确定要${text}app么`}
                onConfirm={() => {
                  if (record.appId) {
                    removeUseApps().then(() => {
                      getApps();
                    });
                  } else {
                    addUseApps().then(() => {
                      getApps();
                    });
                  }
                }}
              >
                <a>{text}</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <div>
          {usedArray.map((ele) => {
            return (
              <div key={ele.appId}>
                {ele.name}

                <Popconfirm
                  title="确认删除么？"
                  onConfirm={() => {
                    this.deleteItem(ele);
                  }}
                >
                  <a href="#">Delete</a>
                </Popconfirm>
              </div>
            );
          })}
        </div>
        <div className="filter-container">
          <Form ref={this.formRef} name="advanced_search" className="ant-advanced-search-form" onFinish={this.onFinish}>
            <Row gutter={gutter}>
              <Col span={span}>
                <Form.Item
                  name="field-1"
                  label="应用名称"
                  rules={[
                    {
                      required: false,
                      message: 'Input something!',
                    },
                  ]}
                >
                  <Input placeholder="placeholder" />
                </Form.Item>
              </Col>
              <Col span={span}>
                <Form.Item
                  name="field-2"
                  label="应用分类"
                  rules={[
                    {
                      required: false,
                      message: 'select something!',
                    },
                  ]}
                >
                  <Select allowClear>
                    {arryCategoryList.map((ele) => {
                      return (
                        <Option key={ele.appId} value={ele.appId}>
                          {ele.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={span}>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <Table rowKey={(r) => r.appId} dataSource={arryCategoryList} columns={columns} pagination={false}></Table>
        </div>
      </div>
    );
  }
}

AppEdit.propTypes = {
  history: PropTypes.object.isRequired,
  getApps: PropTypes.func.isRequired,
  removeUseApps: PropTypes.func.isRequired,
  addUseApps: PropTypes.func.isRequired,
  apps: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  loading: PropTypes.bool,
};

const mapDispatch = (dispatch) => {
  return {
    getApps: dispatch.homepage.getApps,
    removeUseApps: dispatch.homepage.removeUseApps,
    addUseApps: dispatch.homepage.addUseApps,
  };
};

const mapState = (state) => {
  return {
    apps: state.homepage.apps,
    loading: state.loading.effects.homepage.getApps,
  };
};

export default connect(mapState, mapDispatch)(AppEdit);
