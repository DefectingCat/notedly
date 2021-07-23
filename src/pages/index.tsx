import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// children
import Home from './Home';
import Navi from '../components/aside/Navi';
import Profile from './Profile';
import NotePage from './NotePage';
import SignUp from './SignUp';
import Login from './Login';
import { Row, Col, BackTop } from 'antd';
import style from './pages.module.scss';

const Pages = (): JSX.Element => {
  return (
    <>
      <Router>
        <Row justify='center' className={style.test}>
          <Col xs={0} md={9} className={style.side}>
            <Navi />
          </Col>
          <Col xs={23} md={6}>
            <Route exact path='/' component={Home} />
            <Route path='/profile' component={Profile} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={SignUp} />
            <Route path='/note/:id' component={NotePage} />
          </Col>
          <Col xs={0} md={9}>
            col-12
          </Col>
          <BackTop />
        </Row>
      </Router>
    </>
  );
};

export default Pages;
