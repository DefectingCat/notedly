import React from 'react';
import { Avatar, Card } from 'antd';
import style from './post.module.scss';
import { Notes } from '../../pages/Home';
import ActionBar from '../common/ActionBar';

const { Meta } = Card;

const Post = (props: Notes): JSX.Element => {
  const { author, content, createdAt, favoriteCount, id } = props;

  return (
    <>
      <Card
        className={style['post-card']}
        actions={[<ActionBar favoriteCount={favoriteCount} key={id} />]}
        hoverable
      >
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
