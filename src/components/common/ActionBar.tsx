import React from 'react';
import style from './actionBar.module.scss';

const ActionBar = ({
  favoriteCount,
}: {
  favoriteCount: number;
}): JSX.Element => {
  return (
    <>
      <div className={style.warpper}>
        <div className={`${style.action}`}>
          <svg className='icon' aria-hidden='true'>
            <use xlinkHref='#icon-aixin2'></use>
          </svg>
          <span>{favoriteCount}</span>
        </div>

        <div className={`${style.action}`}>
          <svg className='icon' aria-hidden='true'>
            <use xlinkHref='#icon-comment'></use>
          </svg>
          <span>0</span>
        </div>
      </div>
    </>
  );
};

export default ActionBar;
