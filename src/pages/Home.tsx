import React from 'react';
import style from './home.module.scss';
import NewPost from '../components/newPost/NewPost';
import Post from '../components/posts/Post';
import { PageHeader } from 'antd';

function Home(): JSX.Element {
  return (
    <main className={`${style['main']}`}>
      <PageHeader
        backIcon={false}
        className={style['main-header']}
        onBack={() => null}
        title='首页'
      />
      <NewPost />
      <Post />
    </main>
  );
}

export default Home;
