import React from 'react';
import { Avatar, Card } from 'antd';
import style from './post.module.scss';

const { Meta } = Card;

const Post = (): JSX.Element => {
  return (
    <>
      <Card className={style['post-card']}>
        <Meta
          avatar={
            <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
          }
          title='User1'
        />
        <div className={style['post-card-body']}>
          <span>这是一段测试</span>
          <span>Card content</span>
          <div>
            <span>这是一段测试</span>
            <span>Card content</span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Post;
