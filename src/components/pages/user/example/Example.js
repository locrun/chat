import React from 'react';
import SearchPanel from '../../../SearchPanel/SearchPanel';

import * as ReactBootstrap from 'react-bootstrap';
import s from './example.module.scss';

const Example = () => {
  return (
    <div>
      <ReactBootstrap.Dropdown>
        <ReactBootstrap.Dropdown.Toggle variant="falcon-default">
          Dropdown
        </ReactBootstrap.Dropdown.Toggle>
        <ReactBootstrap.Dropdown.Menu className="py-2">
          <ReactBootstrap.Dropdown.Item href="#/action-1">
            Action
          </ReactBootstrap.Dropdown.Item>
          <ReactBootstrap.Dropdown.Item href="#/action-2">
            Another action
          </ReactBootstrap.Dropdown.Item>
          <ReactBootstrap.Dropdown.Item href="#/action-3">
            Something else
          </ReactBootstrap.Dropdown.Item>
          <ReactBootstrap.Dropdown.Divider />
          <ReactBootstrap.Dropdown.Item href="#/action-4">
            Separated link
          </ReactBootstrap.Dropdown.Item>
        </ReactBootstrap.Dropdown.Menu>
      </ReactBootstrap.Dropdown>
      <SearchPanel className={s.search} />
    </div>
  );
};

export default Example;
