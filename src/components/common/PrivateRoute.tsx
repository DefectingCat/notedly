import { message } from 'antd';
import { useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import useStore from '../../store';

/**
 * 受保护的路由
 * 旨在用户未登录的情况访问对应页面时
 * 跳转到 Login 组件
 * @param routeProps 传递给 Route 的路由参数
 * @returns
 */
const PrivateRoute = ({ ...routeProps }: RouteProps) => {
  const { state } = useStore();

  /**
   * 第一次进入 PrivateRoute 时，检查是否已经登录
   * 否则发送对应提示
   */
  useEffect(() => {
    state.isLoggedIn ? void 0 : message.info('先登录哦🐳');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {state.isLoggedIn ? <Route {...routeProps} /> : <Redirect to='/login' />}
    </>
  );
};

export default PrivateRoute;
