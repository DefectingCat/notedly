import React from 'react';
import { PageHeader } from 'antd';
import style from './header.module.scss';

interface Props {
  title: string;
  backable?: boolean;
  onBack?: () => void;
}

const Header = ({ title, backable, onBack }: Props): JSX.Element => {
  /**
   * 利用 backIcon 来控制是否限制返回图标
   * 当 backIcon 为 undefined 则不自定义图片
   * 则会显示返回图标
   * 为 false 时，则不显示返回图标
   */
  backable ? (backable = undefined) : (backable = false);

  return (
    <>
      <PageHeader
        backIcon={backable}
        className={style['main-header']}
        onBack={onBack}
        title={title}
      />
    </>
  );
};

export default Header;
