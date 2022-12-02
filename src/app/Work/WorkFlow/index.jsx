import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WorkFlow from './components/WorkFlow';
import './less/workFlow.less';
import './less/addPopover.less';
import './index.less';

const Index = (props) => {
  const { flowConfig } = props;
  return (
    <div className="work-flow App">
      <WorkFlow config={flowConfig} />
    </div>
  );
};

Index.propTypes = {
  flowConfig: PropTypes.object,
};

const mapState = (state) => {
  return {
    flowConfig: state.WorkFlow.flowConfig,
  };
};

export default connect(mapState, null)(Index);
