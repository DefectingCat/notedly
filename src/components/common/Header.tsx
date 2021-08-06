import { PageHeader, Grid } from 'antd';
import style from './header.module.scss';
import IconFont from './icon/NotedlyIcons';
import Navi from '../aside/Navi';
import { useState } from 'react';

interface Props {
  title: string;
  backable?: boolean;
  onBack?: () => void;
}

const { useBreakpoint } = Grid;

const Header = ({ title, backable, onBack }: Props): JSX.Element => {
  const screens = useBreakpoint();
  const { xs } = screens;

  const [showNavi, setShowNavi] = useState(false);
  const [showModel, setShowModel] = useState(false);

  /**
   * 利用 backIcon 来控制是否限制返回图标
   * 当 backIcon 为 undefined 则不自定义图片
   * 则会显示返回图标
   * 为 false 时，则不显示返回图标
   */
  backable ? (backable = undefined) : (backable = false);

  const openNavi = () => {
    setShowModel(true);
    setTimeout(() => {
      setShowNavi(true);
    }, 0);
  };

  const colseNavi = () => {
    setShowNavi(false);
    setTimeout(() => {
      setShowModel(false);
    }, 299);
  };

  return (
    <>
      <div className={style.wrapper}>
        <PageHeader
          backIcon={backable}
          className={style['main-header']}
          onBack={onBack}
          title={title}
        />
        {xs ? (
          <div className={style.btn}>
            <IconFont
              className={style['icon']}
              type='icon-gengduo'
              onClick={openNavi}
            />

            <div
              className={`${showModel ? '' : style['none-model']} ${
                style.model
              }`}
              onClick={colseNavi}
            >
              <div
                className={`${showNavi ? '' : style['none-navi']} ${
                  style.navi
                }`}
              >
                <Navi />
              </div>
            </div>
          </div>
        ) : (
          void 0
        )}
      </div>
    </>
  );
};

export default Header;
