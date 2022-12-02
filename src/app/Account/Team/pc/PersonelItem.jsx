import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.module.less';

function PersonelItem(props) {
  const { person, handleChangePerson, activePerson } = props;
  console.log(activePerson, 'usernameusernameusername');
  const { realname, username } = person;
  return (
    <div
      className={classNames(styles.PersonelItem, { [styles.PersonelItemActive]: activePerson === username })}
      onClick={() => handleChangePerson(username)}
    >
      <span>
        {realname}/{username}
      </span>
    </div>
  );
}
PersonelItem.propTypes = {
  person: PropTypes.object,
  activePerson: PropTypes.string,
  handleChangePerson: PropTypes.func,
};
export default memo(PersonelItem);
