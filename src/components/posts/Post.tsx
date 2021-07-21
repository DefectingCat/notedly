import React from 'react';
import { Avatar, Card } from 'antd';
import style from './post.module.scss';
import { Notes } from '../../pages/Home';

const { Meta } = Card;

const Post = (props: Notes): JSX.Element => {
  const { author, content, createdAt, favoriteCount } = props;

  return (
    <>
      <Card className={style['post-card']} actions={[`${favoriteCount}`]}>
        <Meta
          avatar={<Avatar src={author.avatar} />}
          title={`@${author.username}`}
          description={`${createdAt.substr(0, 10)} ${createdAt.substr(11, 8)}`}
        />
        <div className={style['post-card-body']}>{content}</div>
      </Card>
    </>
  );
};

export default Post;
