import React from 'react';
import { NavLink } from 'react-router-dom';
import style from './navi.module.scss';

const routes = [
  {
    to: '/',
    name: '首页',
    icon: '#icon-xuanzhongshangcheng',
  },
  {
    to: '/profile',
    name: '我的动态',
    icon: '#icon-dongtai',
  },
  {
    to: '/login',
    name: '登录',
    icon: '#icon-denglu',
  },
];

const Navi = (): JSX.Element => {
  return (
    <div className={style['navi-wrap']}>
      <nav className={style.navi}>
        {routes.map((item) => {
          return (
            <NavLink
              exact
              to={item.to}
              activeClassName={style.active}
              key={item.to}
            >
              <div className={style['navi-btn']}>
                <svg className='icon' aria-hidden='true'>
                  <use xlinkHref={item.icon}></use>
                </svg>
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Navi;
