import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

const GlobalFooter = ({ links, copyright }) => {
  return (
    <footer className="globalFooter">
      {links && (
        <div className="links">
          {links.map((link) => {
            return (
              <a
                key={link.key}
                title={link.key}
                target={link.blankTarget ? '_blank' : '_self'}
                href={link.href}
                rel="noreferrer"
              >
                {link.title}
              </a>
            );
          })}
        </div>
      )}
      {copyright && <div className="copyright">{copyright}</div>}
    </footer>
  );
};

GlobalFooter.propTypes = {
  links: PropTypes.array,
  copyright: PropTypes.node,
};

GlobalFooter.defaultProps = {
  links: [],
  copyright: '',
};

export default GlobalFooter;
