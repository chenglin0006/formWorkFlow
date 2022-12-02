import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MenuContext from '@/layouts/MenuContext';
import BreadcrumbView from './BreadcrumbView';

@withRouter
class Breadcrumb extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
  };

  render() {
    const { className, style } = this.props;

    return (
      <div className={className} style={style}>
        <MenuContext.Consumer>
          {(value) => {
            return <BreadcrumbView {...this.props} {...value} />;
          }}
        </MenuContext.Consumer>
      </div>
    );
  }
}

export default Breadcrumb;
