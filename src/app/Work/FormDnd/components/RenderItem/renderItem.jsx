/* eslint-disable import/no-cycle */
import React from 'react';

import InputDom from './components/InputDom';
import SelectDom from './components/SelectDom';
import InputNumberDom from './components/InputNumberDom';
import UploadDom from './components/UploadDom';
import CascaderDom from './components/CascaderDom';
import TreeSelectDom from './components/TreeSelectDom';
import TextareaDom from './components/TextareaDom';
import CheckboxDom from './components/CheckboxDom';
import RadioDom from './components/RadioDom';
import DatepickerDom from './components/DatepickerDom';
import RangepickerDom from './components/RangepickerDom';
import DetailListDom from './components/DetailListDom';
import LeaveDom from './components/LeaveDom';

const renderFormItem = (item, form, renderType) => {
  let ele = null;
  switch (item.type) {
    case 'input':
      ele = <InputDom element={item} />;
      break;
    case 'textarea':
      ele = <TextareaDom element={item} />;
      break;
    case 'select':
      ele = <SelectDom element={item} />;
      break;
    case 'number':
      ele = <InputNumberDom element={item} />;
      break;
    case 'upload':
      ele = <UploadDom element={item} />;
      break;
    case 'uploadPic':
      ele = <UploadDom uploadType="pic" element={item} />;
      break;
    case 'cascader':
      ele = <CascaderDom element={item} />;
      break;
    case 'treeSelect':
      ele = <TreeSelectDom element={item} />;
      break;
    case 'checkbox':
      ele = <CheckboxDom element={item} />;
      break;
    case 'radio':
      ele = <RadioDom element={item} />;
      break;
    case 'datepicker':
      ele = <DatepickerDom element={item} />;
      break;
    case 'rangepicker':
      ele = <RangepickerDom element={item} />;
      break;
    case 'detailList':
      ele = <DetailListDom element={item} form={form} renderFormItem={renderFormItem} renderType={renderType} />;
      break;
    default:
      ele = null;
  }
  return ele;
};

const renderOwnItem = (item, form) => {
  let ele = null;
  switch (item.type) {
    case 'leave':
      ele = <LeaveDom element={item} form={form} />;
      break;
    default:
      ele = null;
  }
  return ele;
};

export { renderFormItem, renderOwnItem };
