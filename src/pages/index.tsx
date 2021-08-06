import { Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// children
import Navi from '../components/aside/Navi';
import { Row, Col, BackTop, Spin } from 'antd';
import style from './pages.module.scss';
import PrivateRoute from '../components/common/PrivateRoute';

// code splitting
const Home = lazy(() => import('./Home'));
const Profile = lazy(() => import('./Profile'));
const NotePage = lazy(() => import('./NotePage'));
const SignUp = lazy(() => import('./SignUp'));
const Login = lazy(() => import('./Login'));

const Pages = (): JSX.Element => {
  return (
    <>
      <Router>
        <Row justify='center'>
          <Col xs={0} sm={6} md={6} lg={7} xl={9}>
            <Navi />
          </Col>
          <Col xs={23} sm={12} md={12} lg={10} xl={6}>
            <Suspense
              fallback={
                <div className={style.loading}>
                  <Spin size='large' />
                </div>
              }
            >
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={SignUp} />
                <Route path='/note/:id' component={NotePage} />
                <PrivateRoute path='/profile' component={Profile} />
              </Switch>
            </Suspense>
          </Col>
          <Col xs={0} sm={6} md={6} lg={7} xl={9}>
            咸鱼偷懒中
          </Col>
          <BackTop />
        </Row>
      </Router>
    </>
  );
};

export default Pages;
