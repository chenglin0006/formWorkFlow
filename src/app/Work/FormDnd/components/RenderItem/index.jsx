/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import store from '@/store';
import FormContext from '../../FormContext';
import { renderFormItem, renderOwnItem } from './renderItem';
import './index.less';

const Index = (props) => {
  const { element, form, renderType = 'render' } = props;

  const { deleteCard, rightForm, showHoverStyle, activeFormItem } = useContext(FormContext);

  const renderFun = () => {
    const { componentType } = element;
    const { type } = element;
    if (componentType === 'simple') {
      if (renderType === 'render') {
        return (
          <Form.Item label={element.name} name={element.uuid} rules={element.rules || []}>
            {renderFormItem(element, form, renderType)}
          </Form.Item>
        );
      }
      if (type === 'detailList') {
        return renderFormItem(element, form, renderType);
      }
      return (
        <Form.Item label={element.name} name={element.uuid} rules={element.rules || []}>
          {renderFormItem(element, form, renderType)}
        </Form.Item>
      );
    }
    return renderOwnItem(element, form);
  };

  return (
    <div
      key={element.uuid}
      onMouseEnter={() => {
        if (!showHoverStyle) {
          store.dispatch.Dnd.save({
            showHoverStyle: true,
          });
        }
      }}
      className={`render-item-div react-dnd ${renderType} ${
        activeFormItem.uuid === element.uuid && renderType === 'render' ? 'active' : ''
      } ${showHoverStyle ? 'show-hover' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (renderType === 'render') {
          rightForm.setFieldsValue({ defaultValue: null });
          store.dispatch.Dnd.save({
            activeFormItem: element,
          });
        }
      }}
    >
      {renderFun()}
      {renderType === 'render' ? (
        <div
          className="action-div minus"
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(element);
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
  form: PropTypes.object,
  renderType: PropTypes.string,
};

export default Index;
