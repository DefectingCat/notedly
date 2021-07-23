import React from 'react';
import style from './actionBar.module.scss';
import { useMutation, gql } from '@apollo/client';
import { message } from 'antd';

interface Props {
  favoriteCount: number;
  id: string;
}

interface FavoVars {
  toggleFavoriteId: string;
}

interface FavoRes {
  toggleFavorite: ToggleFavorite;
}

interface ToggleFavorite {
  id: string;
  favoriteCount: number;
}

const FAVO_QL = gql`
  mutation ToggleFavoriteMutation($toggleFavoriteId: ID!) {
    toggleFavorite(id: $toggleFavoriteId) {
      id
      favoriteCount
    }
  }
`;

const ActionBar = ({ favoriteCount, id }: Props): JSX.Element => {
  const [favo] = useMutation<FavoRes, FavoVars>(FAVO_QL);

  /**
   * 点赞请求
   * @TODO 根据点赞状态改变按钮填充
   */
  const toFavo = async () => {
    try {
      const { data } = await favo({
        variables: { toggleFavoriteId: id },
      });
      if (data?.toggleFavorite)
        favoriteCount = data.toggleFavorite.favoriteCount;
    } catch (e) {
      console.log(e);
      message.error('点赞失败😲');
    }
  };

  return (
    <>
      <div className={style.warpper}>
        {/* 这个是点赞按钮💖 */}
        <div className={`${style.action}`} onClick={toFavo}>
          <svg className='icon' aria-hidden='true'>
            <use xlinkHref='#icon-aixin2'></use>
          </svg>
          <span>{favoriteCount}</span>
        </div>

        {/* 这个是评论按钮💬 */}
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
