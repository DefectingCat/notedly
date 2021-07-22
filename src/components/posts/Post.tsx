import React from 'react';
import { Avatar, Card } from 'antd';
import style from './post.module.scss';
import { Notes } from '../../pages/Home';
import ActionBar from '../common/ActionBar';
import { useHistory } from 'react-router-dom';

const { Meta } = Card;

const Post = (props: Notes): JSX.Element => {
  const { author, content, createdAt, favoriteCount, id } = props;
  const history = useHistory();

  return (
    <>
      <Card
        className={style['post-card']}
        actions={[<ActionBar favoriteCount={favoriteCount} key={id} />]}
        hoverable
      >
        <div onClick={() => history.push(`/note/${id}`)}>
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
