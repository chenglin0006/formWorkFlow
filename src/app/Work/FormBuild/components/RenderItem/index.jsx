/* eslint-disable import/no-cycle */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import InputDom from './components/InputDom';
import TextareaDom from './components/TextareaDom';
import SelectDom from './components/SelectDom';
import InputNumberDom from './components/InputNumberDom';
import UploadDom from './components/UploadDom';
import LeaveDom from './components/LeaveDom';
import CascaderDom from './components/CascaderDom';
import TreeSelectDom from './components/TreeSelectDom';
import CheckboxDom from './components/CheckboxDom';
import RadioDom from './components/RadioDom';
import DatepickerDom from './components/DatepickerDom';
import RangepickerDom from './components/RangepickerDom';
import DetailList from './components/DetailListDom';
import './index.less';

const Index = (props) => {
  const {
    element,
    activeFormItem = {},
    form,
    renderType = 'render',
    changeCardList,
    canRemove = true,
    showHoverStyle,
    rightForm,
    save,
  } = props;
  useEffect(() => {
    if (activeFormItem && activeFormItem.uuid) {
      const obj = {};
      obj[activeFormItem.uuid] = activeFormItem.defaultValue;
      form.setFieldsValue(obj);
    }
  }, [activeFormItem.defaultValue]);
  const renderFormItem = () => {
    let ele = null;
    switch (element.type) {
      case 'input':
        ele = <InputDom element={element} />;
        break;
      case 'textarea':
        ele = <TextareaDom element={element} />;
        break;
      case 'select':
        ele = <SelectDom element={element} />;
        break;
      case 'number':
        ele = <InputNumberDom element={element} />;
        break;
      case 'upload':
        ele = <UploadDom element={element} />;
        break;
      case 'uploadPic':
        ele = <UploadDom uploadType="pic" element={element} />;
        break;
      case 'cascader':
        ele = <CascaderDom element={element} />;
        break;
      case 'treeSelect':
        ele = <TreeSelectDom element={element} />;
        break;
      case 'checkbox':
        ele = <CheckboxDom element={element} />;
        break;
      case 'radio':
        ele = <RadioDom element={element} />;
        break;
      case 'datepicker':
        ele = <DatepickerDom element={element} />;
        break;
      case 'rangepicker':
        ele = <RangepickerDom element={element} />;
        break;
      case 'detailList':
        ele = <DetailList element={element} />;
        break;
      default:
        ele = null;
    }
    return ele;
  };

  const renderOwnItem = () => {
    let ele = null;
    switch (element.type) {
      case 'leave':
        ele = <LeaveDom element={element} form={form} />;
        break;
      default:
        ele = null;
    }
    return ele;
  };
  return (
    <div
      onMouseEnter={() => {
        if (!showHoverStyle) {
          save({
            showHoverStyle: true,
          });
        }
      }}
      className={`render-item-div ${renderType} ${
        activeFormItem.uuid === element.uuid && renderType === 'render' ? 'active' : ''
      } ${showHoverStyle ? 'show-hover' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (renderType === 'render') {
          rightForm.setFieldsValue({
            defaultValue: null,
          });
          save({
            activeFormItem: element,
          });
        }
      }}
    >
      {element.componentType === 'simple' ? (
        <Form.Item label={element.name} name={element.itemParamName} rules={element.rules || []}>
          {renderFormItem()}
        </Form.Item>
      ) : (
        renderOwnItem()
      )}
      {renderType === 'render' && canRemove ? (
        <div
          className="action-div minus"
          onClick={(e) => {
            e.stopPropagation();
            changeCardList(element, 'minus');
          }}
        >
          x
        </div>
      ) : null}
    </div>
  );
};

Index.propTypes = {
  element: PropTypes.object,
  activeFormItem: PropTypes.object,
  form: PropTypes.object,
  renderType: PropTypes.string,
  changeCardList: PropTypes.func,
  canRemove: PropTypes.bool,
  showHoverStyle: PropTypes.bool,
  rightForm: PropTypes.object,
  save: PropTypes.func,
};

export default Index;
