import React, { useEffect } from 'react';
import { Avatar, Card } from 'antd';
import style from './post.module.scss';
import { Notes } from '../../pages/Home';
import ActionBar from '../common/ActionBar';
import useStore from '../../store';
import { useHistory } from 'react-router';

const { Meta } = Card;

const Post = (props: Notes): JSX.Element => {
  const { author, content, createdAt, favoriteCount, id } = props;
  const history = useHistory();
  const { state, setUserState } = useStore();

  let scrolledTop = 0;

  /**
   * 每次 Post 被重绘时
   * 都记录下当前的滚动位置
   */
  useEffect(() => {
    scrolledTop = document.documentElement.scrollTop || document.body.scrollTop;
  });

  /**
   * 从 Post 列表进入到详情页面 NotePage 时
   * 记录当前 scrolledTop 值到状态管理
   * 用于返回首页时滚动到指定位置
   */
  const intoPost = () => {
    setUserState({ ...state, scrolledTop });
    history.push(`/note/${id}`);
  };

  return (
    <>
      <Card
        className={style['post-card']}
        actions={[<ActionBar favoriteCount={favoriteCount} id={id} key={id} />]}
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
