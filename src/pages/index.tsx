import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// children
import Home from './Home';
import { Navi } from '../components/aside/Navi';
import MyNote from './MyNote';
import { Row, Col } from 'antd';
import style from './pages.module.scss';

const Pages = (): JSX.Element => {
  return (
    <>
      <Router>
        <Row className={style.layout}>
          <Col span={9} className={`${style.side} ${style['side-left']}`}>
            <Navi />
          </Col>
          <Col span={6}>
            <Route exact path='/' component={Home} />
            <Route path='/mynotes' component={MyNote} />
          </Col>
          <Col span={9} className={`${style.side} ${style['side-right']}`}>
            col-12
          </Col>
        </Row>{' '}
      </Router>
    </>
  );
};

export default Pages;
