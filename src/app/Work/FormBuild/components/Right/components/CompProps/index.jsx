import React, { useState, useEffect, Fragment, useMemo } from 'react';
import './index.less';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { Tools, TreeIterator } from '@/util';
import store from '@/store';

import RenderLeaveProps from './components/LeaveProps/index'; // 请假组件属性
import RenderTitleProps from './components/renderTitleProps'; // 标题
// import RenderUuidProps from './components/renderUuidProps'; // 字段id
import RenderItemNameProps from './components/renderItemNameProps'; // 字段参数
import RenderPlaceholderProps from './components/renderPlaceholderProps'; // 占位
import RenderDefaultValueProps from './components/renderDefaultValueProps'; // 默认值
import RenderIsRequiredProps from './components/renderIsRequiredProps'; // 是否必填
import RenderColSpanProps from './components/renderColSpanProps'; // 表格栅栏
import RenderMaxLengthProps from './components/renderMaxLengthProps'; // 最长输入字符
import RenderMaxAndMinProps from './components/renderMaxAndMinProps'; // 最大最小值
import RenderMultipleProps from './components/renderMultipleProps'; // 是否多选
import RenderUploadListCardProps from './components/renderUploadListCardProps'; // 上传文件展示方式
import RenderIfSearchProps from './components/renderIfSearchProps'; // 是否可搜索
import RenderSelectTypeProps from './components/renderSelectTypeProps'; // 选项枚举配置方式
import RenderApiEnumProps from './components/renderApiEnumProps'; // api
import RenderTreeEnumProps from './components/renderTreeEnumProps'; // 树形枚举展示
import RenderListEnumProps from './components/renderListEnumProps'; // 列表枚举展示
import RenderAddEnumBtn from './components/renderAddEnumBtn'; // 添加选项/树形父级按钮
import RenderModeProps from './components/renderModeProps'; // 添加选项/树形父级按钮
import RenderShowTimeProps from './components/renderShowTimeProps'; // 添加选项/树形父级按钮
import AddEnumModal from './components/addEnumModal';

const Index = (props) => {
  const [form] = Form.useForm();
  const { activeFormItem, cardList, save } = props;
  const [selectEnumList, setSelectEnumList] = useState([]);
  const [selectTreeEnumList, setSelectTreeEnumList] = useState([]);
  const [selectType, setSelectType] = useState(1);
  const [isMultiple, setIsMultiple] = useState(false);
  const [showAddEnumModal, setShowAddEnumModal] = useState(false);
  const [activeEnumNode, setActiveEnumNode] = useState();
  const [enumModalType, setEnumModalType] = useState('add');

  useEffect(() => {
    save({
      rightForm: form,
    });
  }, []);

  const changeCardListStore = (v, itemName) => {
    const l = [...cardList];
    l.forEach((ele) => {
      if (ele.uuid === activeFormItem.uuid) {
        if (itemName === 'required') {
          if (ele.rules && ele.rules.length) {
            ele.rules.forEach((r) => {
              const keys = Object.keys(r).filter((f) => {
                return f === 'required';
              });
              if (keys.length) {
                r.required = v;
              }
            });
          } else {
            ele.rules = [{ required: v, message: '请输入' }];
          }
          ele.isRequired = v;
        } else if (itemName === 'min' || itemName === 'max') {
          ele.value = '';
          ele.defaultValue = '';
          form.setFieldsValue({ defaultValue: '' });
          ele[itemName] = v;
        } else {
          ele[itemName] = v;
        }
      } else if (ele.children) {
        ele.children.forEach((c) => {
          if (c.uuid === activeFormItem.uuid) {
            if (itemName === 'required') {
              if (c.rules && c.rules.length) {
                c.rules.forEach((r) => {
                  const keys = Object.keys(r).filter((f) => {
                    return f === 'required';
                  });
                  if (keys.length) {
                    r.required = v;
                  }
                });
              } else {
                c.rules = [{ required: v, message: '请输入' }];
              }
            } else {
              c[itemName] = v;
            }
          }
        });
      }
    });
    store.dispatch.Dnd.save({
      cardList: l,
    });
    if (itemName === 'uuid') {
      const a = { ...activeFormItem };
      a.uuid = v;
      store.dispatch.Dnd.save({
        activeFormItem: a,
      });
    }
  };

  useEffect(() => {
    if (activeFormItem.uuid) {
      setSelectType(activeFormItem.selectType || 1);
      setIsMultiple(activeFormItem.multiple);
      form.setFieldsValue({
        itemParamName: activeFormItem.itemParamName,
        label: activeFormItem.name,
        isRequired: activeFormItem.isRequired,
        placeholder: activeFormItem.placeholder,
        selectType: activeFormItem.selectType,
        defaultValue: activeFormItem.defaultValue,
        maxLength: activeFormItem.maxLength,
        mode: activeFormItem.mode,
        multiple: activeFormItem.multiple,
        listType: activeFormItem.listType,
        colSpan: activeFormItem.colSpan,
        leaveLayout: activeFormItem.leaveLayout,
        uploadText: activeFormItem.uploadText,
        showTime: activeFormItem.showTime || false,
        apiUrl: activeFormItem.apiUrl || '',
        maxSize: activeFormItem.maxSize,
        maxNumber: activeFormItem.maxNumber,
        accept: activeFormItem.accept || [],
      });
      if (
        (activeFormItem.type === 'select' || activeFormItem.type === 'checkbox' || activeFormItem.type === 'radio') &&
        activeFormItem.options &&
        activeFormItem.options.length
      ) {
        setSelectEnumList(activeFormItem.options);
      } else {
        setSelectEnumList([]);
      }

      if (
        (activeFormItem.type === 'cascader' || activeFormItem.type === 'treeSelect') &&
        activeFormItem.options &&
        activeFormItem.options.length
      ) {
        setSelectTreeEnumList(activeFormItem.options);
      } else {
        setSelectTreeEnumList([]);
      }
    }
  }, [activeFormItem.uuid]);
  useEffect(() => {
    if (activeFormItem.uuid) {
      const s = Tools.deepClone(selectEnumList);
      changeCardListStore(s, 'options');
      if (activeFormItem.defaultValue) {
        // changeCardListStore(activeFormItem.defaultValue, 'defaultValue');
      } else {
        changeCardListStore(isMultiple ? [] : '', 'defaultValue');
      }
    }
  }, [JSON.stringify(selectEnumList), isMultiple]);

  useEffect(() => {
    const s = Tools.deepClone(selectTreeEnumList);
    TreeIterator.each(s, (i) => {
      i.key = i.value;
    });
    changeCardListStore(s, 'options');
    if (activeFormItem.defaultValue) {
      // changeCardListStore(activeFormItem.defaultValue, 'defaultValue');
    } else {
      changeCardListStore(isMultiple ? [] : '', 'defaultValue');
    }
  }, [JSON.stringify(selectTreeEnumList), isMultiple]);

  const renderIfSearchFun = () => {
    return <RenderIfSearchProps changeCardListStore={changeCardListStore} />;
  };

  const renderListSelectEnumFun = () => {
    return (
      <RenderListEnumProps
        setActiveEnumNode={setActiveEnumNode}
        setShowAddEnumModal={setShowAddEnumModal}
        selectEnumList={selectEnumList}
        setSelectEnumList={setSelectEnumList}
        setEnumModalType={setEnumModalType}
        form={form}
      />
    );
  };

  const renderApiEnumFun = () => {
    return (
      <RenderApiEnumProps
        setData={(list, v) => {
          changeCardListStore(v, 'apiUrl');
          if (
            activeFormItem.type === 'select' ||
            activeFormItem.type === 'checkbox' ||
            activeFormItem.type === 'radio'
          ) {
            setSelectEnumList(list);
          } else if (activeFormItem.type === 'cascader' || activeFormItem.type === 'treeSelect') {
            setSelectTreeEnumList(list);
          }
        }}
      />
    );
  };

  const renderAddTreeBtnFun = () => {
    return (
      <RenderAddEnumBtn
        activeFormItem={activeFormItem}
        setShowAddEnumModal={setShowAddEnumModal}
        setEnumModalType={setEnumModalType}
      />
    );
  };
  const renderModeFun = () => {
    return <RenderModeProps setIsMultiple={setIsMultiple} changeCardListStore={changeCardListStore} />;
  };

  const renderSelectTypeFun = () => {
    return <RenderSelectTypeProps changeCardListStore={changeCardListStore} setSelectType={setSelectType} />;
  };

  const renderListEnumPropsFun = () => {
    return (
      <Fragment>
        {renderSelectTypeFun()}
        {selectType === 1 ? renderAddTreeBtnFun() : renderApiEnumFun()}
        {renderListSelectEnumFun()}
      </Fragment>
    );
  };

  const renderSelectPropsFun = () => {
    return (
      <Fragment>
        {renderIfSearchFun()}
        {renderModeFun()}
        {renderListEnumPropsFun()}
      </Fragment>
    );
  };

  const renderMultipleFun = () => {
    return (
      <RenderMultipleProps
        activeFormItem={activeFormItem}
        changeCardListStore={changeCardListStore}
        setIsMultiple={setIsMultiple}
      />
    );
  };

  const addEnumOkFun = (values) => {
    if (activeFormItem.type === 'cascader' || activeFormItem.type === 'treeSelect') {
      const obj = { label: values.label, value: values.value, children: [] };
      const l = Tools.deepClone(selectTreeEnumList);
      if (activeEnumNode) {
        TreeIterator.each(l, (item) => {
          if (item.value === activeEnumNode.value) {
            if (enumModalType === 'add') {
              const { children = [] } = item;
              children.push(obj);
              item.children = children;
            } else {
              item.label = values.label;
              item.value = values.value;
            }
          }
        });
      } else {
        l.push(obj);
      }
      setSelectTreeEnumList(l);
    } else if (
      activeFormItem.type === 'select' ||
      activeFormItem.type === 'checkbox' ||
      activeFormItem.type === 'radio'
    ) {
      const l = [...selectEnumList];
      if (activeEnumNode) {
        l.forEach((ele) => {
          if (ele.uuid === activeEnumNode.uuid) {
            ele.value = values.value;
            ele.label = values.label;
          }
        });
      } else {
        const obj = {
          label: values.label,
          value: values.value,
          uuid: Tools.uuid(),
        };
        l.push(obj);
        setSelectEnumList(l);
      }
    }
    setShowAddEnumModal(false);
    setActiveEnumNode(null);
  };

  const enumModalData = useMemo(() => {
    let l = [];
    if (activeFormItem.type === 'select') {
      l = selectEnumList;
    } else if (activeFormItem.type === 'cascader' || activeFormItem.type === 'treeSelect') {
      l = selectTreeEnumList;
    }
    return l;
  }, [activeFormItem.type, selectEnumList, selectTreeEnumList]);

  if (!activeFormItem.uuid) {
    return null;
  }
  return (
    <div className="comp-props-div">
      <Form
        form={form}
        layout="vertical"
        // labelCol={{ span: 6 }}
        // wrapperCol={{ span: 18 }}
        name="com"
        initialValues={{
          isRequired: false,
          selectType: 1,
        }}
      >
        {activeFormItem.componentType === 'simple' ? (
          <Fragment>
            {/* <RenderUuidProps
              changeCardListStore={changeCardListStore}
              form={form}
              activeFormItem={activeFormItem}
              cardList={cardList}
            /> */}
            <RenderItemNameProps
              changeCardListStore={changeCardListStore}
              form={form}
              activeFormItem={activeFormItem}
              cardList={cardList}
            />
            <RenderTitleProps changeCardListStore={changeCardListStore} />
            <RenderPlaceholderProps changeCardListStore={changeCardListStore} />
            <RenderColSpanProps changeCardListStore={changeCardListStore} />
            {activeFormItem.type !== 'upload' ? (
              <RenderDefaultValueProps
                changeCardListStore={changeCardListStore}
                activeFormItem={activeFormItem}
                isMultiple={isMultiple}
                selectEnumList={selectEnumList}
                selectTreeEnumList={selectTreeEnumList}
              />
            ) : null}
            <RenderIsRequiredProps changeCardListStore={changeCardListStore} />
          </Fragment>
        ) : null}
        {activeFormItem.type === 'upload' || activeFormItem.type === 'uploadPic' ? renderMultipleFun() : null}
        {activeFormItem.type === 'upload' || activeFormItem.type === 'uploadPic' ? (
          <RenderUploadListCardProps
            uploadType={activeFormItem.type === 'uploadPic' ? 'pic' : 'file'}
            changeCardListStore={changeCardListStore}
          />
        ) : null}
        {activeFormItem.type === 'select' ? renderSelectPropsFun() : null}
        {activeFormItem.type === 'checkbox' ? renderListEnumPropsFun() : null}
        {activeFormItem.type === 'radio' ? renderListEnumPropsFun() : null}
        {activeFormItem.type === 'input' || activeFormItem.type === 'textarea' ? (
          <RenderMaxLengthProps changeCardListStore={changeCardListStore} />
        ) : null}
        {activeFormItem.type === 'number' ? <RenderMaxAndMinProps changeCardListStore={changeCardListStore} /> : null}
        {activeFormItem.type === 'datepicker' || activeFormItem.type === 'rangepicker' ? (
          <RenderShowTimeProps changeCardListStore={changeCardListStore} />
        ) : null}
        {activeFormItem.type === 'cascader' || activeFormItem.type === 'treeSelect' ? (
          <Fragment>
            {renderMultipleFun()}
            {renderIfSearchFun()}
            {renderSelectTypeFun()}
            {selectType === 1 ? renderAddTreeBtnFun() : renderApiEnumFun()}
            <RenderTreeEnumProps
              selectTreeEnumList={selectTreeEnumList}
              setEnumModalType={setEnumModalType}
              setActiveEnumNode={setActiveEnumNode}
              setSelectTreeEnumList={setSelectTreeEnumList}
              setShowAddEnumModal={setShowAddEnumModal}
            />
          </Fragment>
        ) : null}
        {activeFormItem.type === 'leave' ? <RenderLeaveProps changeCardListStore={changeCardListStore} /> : null}
      </Form>
      {showAddEnumModal ? (
        <AddEnumModal
          enumModalData={enumModalData}
          enumModalType={enumModalType}
          activeEnumNode={activeEnumNode}
          onOk={addEnumOkFun}
          onClose={() => {
            setShowAddEnumModal(false);
            setActiveEnumNode(null);
          }}
        />
      ) : null}
    </div>
  );
};
Index.propTypes = {
  activeFormItem: PropTypes.object,
  cardList: PropTypes.array,
  save: PropTypes.func,
};

export default Index;
