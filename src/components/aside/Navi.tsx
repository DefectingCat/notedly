import React from 'react';
import { NavLink } from 'react-router-dom';
import style from './navi.module.scss';

export const Navi = (): JSX.Element => {
  return (
    <div className={style['navi-wrap']}>
      <nav className={style.navi}>
        <NavLink to='/'>
          <div className={style['navi-btn']}>
            <svg className='icon' aria-hidden='true'>
              <use xlinkHref='#icon-xuanzhongshangcheng'></use>
            </svg>
            <span>首页</span>
          </div>
        </NavLink>

        <NavLink to='/mynotes'>
          <div className={style['navi-btn']}>
            <svg className='icon' aria-hidden='true'>
              <use xlinkHref='#icon-dongtai'></use>
            </svg>
            <span>我的动态</span>
          </div>
        </NavLink>
      </nav>
    </div>
  );
};
