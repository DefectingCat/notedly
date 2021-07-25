import React, { useState } from 'react';
import { Avatar, Card, message } from 'antd';
import style from './post.module.scss';
import { Notes } from '../../pages/Home';
import ActionBar from '../common/ActionBar';
import useStore from '../../store';
import { useHistory } from 'react-router';
import { useMutation, gql } from '@apollo/client';

const { Meta } = Card;

interface Props extends Notes {}

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

const Post = (props: Props): JSX.Element => {
  const { author, content, createdAt, id, favoritedBy } = props;
  let { favoriteCount } = props;
  const history = useHistory();
  const { state, setUserState } = useStore();

  /**
   * 点赞
   */
  const [favo] = useMutation<FavoRes, FavoVars>(FAVO_QL);

  let scrolledTop = 0;

  /**
   * 从 Post 列表进入到详情页面 NotePage 时
   * 记录当前 scrolledTop 值到状态管理
   * 用于返回首页时滚动到指定位置
   */
  const intoPost = () => {
    scrolledTop = document.documentElement.scrollTop || document.body.scrollTop;
    setUserState({ ...state, scrolledTop });
    history.push(`/note/${id}`);
  };

  /**
   * 根据当前登录用户
   * 判断是当前用户是否已经点赞
   */
  const tryFavo = favoritedBy.find((item) => item.id === state.user.id);
  const [favoed, setFavoed] = useState(!!tryFavo);

  /**
   * 该方法用于传递给子组件更新点赞状态
   * @CAUTION 这里是直接修改父组件所传递的
   * favoriteCount 来达到修改点赞数量
   * 由于数量会被直接保存到服务器
   * 所以这里没有单独管理状态
   * 选择直接修改 props
   */
  const toFavo = async () => {
    try {
      const { data } = await favo({
        variables: { toggleFavoriteId: id },
      });
      if (data?.toggleFavorite) {
        favoriteCount = data.toggleFavorite.favoriteCount;
        setFavoed(!favoed);
      }
    } catch (e) {
      console.log(e);
      message.error('点赞失败😲');
    }
  };

  return (
    <>
      <Card
        className={style['post-card']}
        actions={
          favoed
            ? [
                <ActionBar
                  favoriteCount={favoriteCount}
                  id={id}
                  key={id}
                  favoed={favoed}
                  toFavo={toFavo}
                />,
              ]
            : [
                <ActionBar
                  favoriteCount={favoriteCount}
                  id={id}
                  key={id}
                  favoed={favoed}
                  toFavo={toFavo}
                />,
              ]
        }
        hoverable
      >
        <div onClick={intoPost}>
          <Meta
            avatar={<Avatar src={author.avatar} />}
            title={`@${author.username}`}
            description={`${createdAt.substr(0, 10)} ${createdAt.substr(
              11,
              8
            )}`}
          />
          <div className={style['post-card-body']}>{content}</div>
        </div>
      </Card>
    </>
  );
};

export default Post;
