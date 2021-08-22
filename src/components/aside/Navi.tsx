import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import style from './navi.module.scss';
import useStore from '../../store';
import IconFont from '../common/icon/NotedlyIcons';

type NaviItem =
  | {
      to: string;
      name: string;
      icon: string;
      private?: undefined;
      logined?: undefined;
    }
  | {
      to: string;
      name: string;
      icon: string;
      private: boolean;
      logined?: undefined;
    }
  | {
      to: string;
      name: string;
      icon: string;
      logined: boolean;
      private?: undefined;
    };

const routes = [
  {
    to: '/',
    name: '首页',
    icon: 'icon-xuanzhongshangcheng',
  },
  {
    to: '/profile',
    name: '我的动态',
    icon: 'icon-dongtai',
    private: true,
  },
  {
    to: '/login',
    name: '登录',
    icon: 'icon-denglu',
    logined: true,
  },
];

/**
 * 重复逻辑抽离
 * @param item 循环中的单个菜单项
 * @returns
 */
const Navis = (item: NaviItem) => {
  return (
    <NavLink exact to={item.to} activeClassName={style.active} key={item.to}>
      <div className={style['navi-btn']}>
        <IconFont type={item.icon} />
        <span>{item.name}</span>
      </div>
    </NavLink>
  );
};

const Navi: React.FC = () => {
  const { state } = useStore();

  useEffect(() => {
    void 0; // 什么也不做 登录后重新绘制菜单
  }, [state.isLoggedIn]);

  return (
    <div className={style['navi-wrap']}>
      <nav className={style.navi}>
        {/* eslint-disable-next-line array-callback-return */}
        {routes.map((item) => {
          // ToDo 后续可能会重构

          /**
           * 现在根据是否登录进行判断
           * 如果用户已经登录，
           * 则不加载 logined 的菜单；
           * 如果用户没有登录
           * 则不加载 private 的菜单。
           */
          if (state.isLoggedIn) {
            if (!item.logined) return Navis(item);
          } else {
            if (!item.private) return Navis(item);
          }
        })}
      </nav>
    </div>
  );
};

export default Navi;
