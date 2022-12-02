/* 默认值 */
import React, { useState, useEffect, Fragment } from 'react';
import { Input, Form, Select, Cascader, TreeSelect, InputNumber, DatePicker } from 'antd';
import { TreeIterator } from '@/util';
import PropTypes from 'prop-types';

const { Option } = Select;

const { RangePicker } = DatePicker;

const RenderDefaultValueProps = (props) => {
  const { changeCardListStore, selectEnumList, isMultiple, activeFormItem, selectTreeEnumList } = props;
  const [treeSelectData, setTreeSelectData] = useState([]);
  useEffect(() => {
    const t = TreeIterator.map(selectTreeEnumList, (item) => {
      item.title = item.label;
      return item;
    });
    setTreeSelectData(t);
  }, [selectTreeEnumList]);
  const renderDefault = () => {
    if (activeFormItem.type === 'select' || activeFormItem.type === 'radio' || activeFormItem.type === 'checkbox') {
      let mode = '';
      if ((activeFormItem.type === 'select' && isMultiple) || activeFormItem.type === 'checkbox') {
        mode = 'multiple';
      }
      return (
        <Select
          allowClear
          mode={mode}
          onChange={(v) => {
            changeCardListStore(v, 'defaultValue');
          }}
        >
          {selectEnumList.map((s) => {
            return <Option key={s.value} value={s.value}>{`${s.label}(${s.value})`}</Option>;
          })}
        </Select>
      );
    }
    if (activeFormItem.type === 'cascader') {
      return (
        <Cascader
          allowClear
          options={selectTreeEnumList}
          multiple={isMultiple}
          onChange={(v) => {
            console.log(v);
            changeCardListStore(v, 'defaultValue');
          }}
        />
      );
    }
    if (activeFormItem.type === 'treeSelect') {
      return (
        <TreeSelect
          allowClear
          treeData={treeSelectData}
          multiple={isMultiple}
          onChange={(v) => {
            console.log(v);
            changeCardListStore(v, 'defaultValue');
          }}
        />
      );
    }
    if (activeFormItem.type === 'number') {
      return (
        <InputNumber
          min={activeFormItem.min || activeFormItem.min === 0 ? activeFormItem.min : null}
          max={activeFormItem.max || activeFormItem.max === 0 ? activeFormItem.max : null}
          onChange={(v) => {
            changeCardListStore(v, 'defaultValue');
          }}
        />
      );
    }
    if (activeFormItem.type === 'datepicker') {
      return (
        <DatePicker
          showTime={activeFormItem.showTime}
          onChange={(v) => {
            changeCardListStore(v, 'defaultValue');
          }}
        />
      );
    }
    if (activeFormItem.type === 'rangepicker') {
      return (
        <RangePicker
          showTime={activeFormItem.showTime}
          onChange={(v) => {
            changeCardListStore(v, 'defaultValue');
          }}
        />
      );
    }
    return (
      <Input
        onChange={(v) => {
          changeCardListStore(v.target.value, 'defaultValue');
        }}
      />
    );
  };
  return (
    <Fragment>
      <Form.Item label="默认值" name="defaultValue">
        {renderDefault()}
      </Form.Item>
    </Fragment>
  );
};

RenderDefaultValueProps.propTypes = {
  changeCardListStore: PropTypes.func,
  selectEnumList: PropTypes.array,
  isMultiple: PropTypes.bool,
  activeFormItem: PropTypes.object,
  selectTreeEnumList: PropTypes.array,
};

export default RenderDefaultValueProps;
