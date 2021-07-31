import { createElement, ReactNode, useState } from 'react';
import { Comment, Avatar, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import style from './postcomment.module.scss';

interface Props {
  children?: ReactNode;
}

const PostComment = ({ children }: Props) => {
  const [likes, setLikes] = useState(0);
  const [action, setAction] = useState('');

  const like = () => {
    setLikes(1);
    setAction('liked');
  };

  const actions = [
    <Tooltip key='comment-basic-like' title='Like'>
      <span onClick={like} className={style['comment-like']}>
        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
        <span className={style['comment-like-action']}>{likes}</span>
      </span>
    </Tooltip>,
    <span key='comment-basic-reply-to'>回复</span>,
  ];

  return (
    <>
      <Comment
        actions={actions}
        author={'Han Solo'}
        avatar={
          <Avatar
            src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
            alt='Han Solo'
          />
        }
        content={
          <p>
            We supply a series of design principles, practical patterns and high
            quality design resources (Sketch and Axure), to help people create
            their product prototypes beautifully and efficiently.
          </p>
        }
      >
        {children}
      </Comment>
    </>
  );
};

export default PostComment;
