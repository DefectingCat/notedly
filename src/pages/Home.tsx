import React from 'react';
import style from './home.module.scss';
import NewPost from '../components/newPost/NewPost';
import Post from '../components/posts/Post';
import { PageHeader } from 'antd';
import { useQuery, gql } from '@apollo/client';
import { Card } from 'antd';

export interface Notes {
  id: string;
  author: {
    username: string;
    id: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
  content: string;
  favoriteCount: number;
}

interface NoteKeys {
  noteFeed: {
    notes: Notes[];
    cursor: string;
    hasNextPage: boolean;
  };
}

interface CursorVars {
  noteFeedCursor: string;
}

const GET_NOTES = gql`
  query NoteFeed($noteFeedCursor: String) {
    noteFeed(cursor: $noteFeedCursor) {
      notes {
        id
        author {
          username
          id
          email
          avatar
        }
        createdAt
        content
        favoriteCount
      }
      cursor
      hasNextPage
    }
  }
`;

function Home(): JSX.Element {
  const { data, loading, error, fetchMore } = useQuery<NoteKeys, CursorVars>(
    GET_NOTES
  );

  return (
    <main className={`${style['main']}`}>
      <PageHeader
        backIcon={false}
        className={style['main-header']}
        onBack={() => null}
        title='首页'
      />
      <NewPost />
      {error ? (
        <p>Loading failure</p>
      ) : loading ? (
        <Card className={style['loading-card']} loading={loading} hoverable />
      ) : (
        data?.noteFeed.notes.map((item) => {
          return <Post key={item.id} {...item} />;
        })
      )}
    </main>
  );
}

export default Home;
