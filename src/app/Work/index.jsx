import React, { useState } from 'react';
import { Tabs, Button, Drawer, Form, Row } from 'antd';
import { useSelector } from 'react-redux';
import WorkFlow from './WorkFlow';
import BasicContainer from './Basic';
import FormContainer from './FormDnd';
import RenderItem from './FormBuild/components/RenderItem';
import './index.less';

const { TabPane } = Tabs;

const App = () => {
  const [form] = Form.useForm();
  const DndData = useSelector((state) => state.Dnd);

  const { cardList } = DndData;
  const tabData = [
    { id: '1', name: '基本信息' },
    { id: '2', name: '审批表单' },
    { id: '3', name: '审批流程' },
    { id: '4', name: '扩展设置' },
  ];

  const [activeTab, setActiveTab] = useState('1');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const renderTab = () => {
    if (activeTab === '1') {
      return <BasicContainer />;
    }
    if (activeTab === '2') {
      return <FormContainer />;
    }
    if (activeTab === '3') {
      return <WorkFlow />;
    }
    return '1231';
  };

  const previewFun = () => {
    setShowPreviewModal(true);
  };

  const renderForm = (renderType) => {
    return (
      <Form form={form}>
        <Row gutter={16}>
          {cardList.map((ele) => {
            return ele && ele.uuid ? (
              <RenderItem key={ele.uuid} form={form} element={ele} renderType={renderType} />
            ) : null;
          })}
        </Row>
      </Form>
    );
  };

  return (
    <div className="work-container">
      <div className="work-header">
        <div className="form-name-div">表单名称</div>
        <div className="form-tab-div">
          <Tabs
            activeKey={activeTab}
            onChange={(v) => {
              setActiveTab(v);
            }}
          >
            {tabData.map((ele) => {
              return <TabPane key={ele.id} tab={ele.name} />;
            })}
          </Tabs>
        </div>
        <div className="form-action-div">
          <Button type="primary" disabled={cardList.length === 0} onClick={previewFun} style={{ marginRight: '10px' }}>
            预览
          </Button>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              const obj = {
                cardList,
              };
              console.log(JSON.stringify(obj));
            }}
          >
            发布
          </Button>
        </div>
      </div>
      <div className="work-content">{renderTab()}</div>
      <Drawer
        width={500}
        title="预览"
        visible={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
        }}
        footer={false}
        destroyOnClose
      >
        {renderForm('preview')}
      </Drawer>
    </div>
  );
};

export default App;
