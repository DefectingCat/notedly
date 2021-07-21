import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// children
import Home from './Home';
import Navi from '../components/aside/Navi';
import MyNote from './MyNote';
import NotePage from './NotePage';
import Header from '../components/common/Header';
import { Row, Col } from 'antd';
import style from './pages.module.scss';

const Pages = (): JSX.Element => {
  return (
    <>
      <Router>
        <Row justify='center'>
          <Col xs={0} md={9} className={style.side}>
            <Navi />
          </Col>
          <Col xs={23} md={6}>
            <Header />
            <Route exact path='/' component={Home} />
            <Route path='/mynotes' component={MyNote} />
            <Route path='/note/:id' component={NotePage} />
          </Col>
          <Col xs={0} md={9}>
            col-12
          </Col>
        </Row>
      </Router>
    </>
  );
};

export default Pages;
