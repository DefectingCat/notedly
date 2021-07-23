import React, { useEffect } from 'react';
import style from './home.module.scss';
import NewPost from '../components/newPost/NewPost';
import Post from '../components/posts/Post';
import Header from '../components/common/Header';
import { useQuery, gql } from '@apollo/client';
import LoadingCard from '../components/common/LoadingCard';
import LoadError from '../components/common/LoadError';
import InfiniteScroll from 'react-infinite-scroll-component';
import useStore from '../store';

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

export interface NoteKeys {
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

const Home = (): JSX.Element => {
  // fetchMore
  const { data, loading, error, fetchMore } = useQuery<NoteKeys, CursorVars>(
    GET_NOTES
  );

  const { state } = useStore();

  /**
   * 每次进入首页时
   * 恢复到上次浏览的位置
   * 防止过度滚动，只监听 state.scrolledTop
   */
  useEffect(() => {
    window.scrollTo(0, state.scrolledTop);
  }, [state.scrolledTop]);

  const fetchMoreData = async () => {
    await fetchMore({
      variables: { noteFeedCursor: data?.noteFeed.cursor },
    });
  };

  return (
    <main className={`${style['main']}`}>
      <Header title='首页' />
      <NewPost />
      {error ? (
        <LoadError />
      ) : loading ? (
        <LoadingCard loading />
      ) : data ? (
        <InfiniteScroll
          dataLength={data.noteFeed.notes.length}
          next={fetchMoreData}
          hasMore={data.noteFeed.hasNextPage}
          loader={<LoadingCard loading />}
        >
          {data.noteFeed.notes.map((item) => {
            return <Post key={item.id} {...item} />;
          })}
        </InfiniteScroll>
      ) : (
        <LoadError />
      )}
    </main>
  );
};

export default Home;
