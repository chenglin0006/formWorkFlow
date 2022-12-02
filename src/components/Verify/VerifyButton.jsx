import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import VerifySlideFixed from '@/components/Verify/VerifySlideFixed';

class VerifyButton extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  verifySlideFixedChild = (data) => {
    this.setState({
      visible: data,
    });
  };

  render() {
    const { children, ...rest } = this.props;
    const { visible } = this.state;

    return (
      <div>
        <Button {...rest}>{children}</Button>

        {visible && (
          <VerifySlideFixed
            isSlideShow={visible}
            verifyPointFixedChild={this.verifySlideFixedChild}
            onOK={this.onVerifySuccess}
          />
        )}
      </div>
    );
  }
}

export default VerifyButton;
