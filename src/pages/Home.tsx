import React from 'react';
import style from './home.module.scss';
import NewPost from '../components/newPost/NewPost';
import Post from '../components/posts/Post';
import { useQuery, gql } from '@apollo/client';
import LoadingCard from '../components/common/LoadingCard';
import LoadError from '../components/common/LoadError';

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
  // fetchMore
  const { data, loading, error } = useQuery<NoteKeys, CursorVars>(GET_NOTES);

  return (
    <main className={`${style['main']}`}>
      <NewPost />
      {error ? (
        <LoadError />
      ) : loading ? (
        <LoadingCard loading />
      ) : (
        data?.noteFeed.notes.map((item) => {
          return <Post key={item.id} {...item} />;
        })
      )}
    </main>
  );
}

export default Home;
