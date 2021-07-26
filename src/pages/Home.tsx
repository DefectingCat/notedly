import React, { useEffect } from 'react';
import style from './home.module.scss';
import NewPost from '../components/newPost/NewPost';
import Header from '../components/common/Header';
import { useQuery, gql } from '@apollo/client';
import LoadingCard from '../components/common/LoadingCard';
import LoadError from '../components/common/LoadError';
import InfiniteScroll from 'react-infinite-scroll-component';
import useStore from '../store';
import MemoPosts from '../components/common/Postlist';

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
  favoritedBy: {
    id: string;
    username: string;
  }[];
}

export interface NoteKeys {
  noteFeed: {
    notes: Notes[];
    cursor: string;
    hasNextPage: boolean;
  };
}

export interface CursorVars {
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
        favoritedBy {
          id
          username
        }
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

  /**
   * fetchMoreData
   * 该函数用于滚动到底部加载新的数据
   * 用 cache.ts 判断并合并新的数据
   */
  const fetchMoreData = async () => {
    await fetchMore?.({
      variables: { noteFeedCursor: data?.noteFeed.cursor },
    });
  };

  /**
   * 该函数传递给子组件 NewPost.tsx
   * 用户发布了新的 post 后，获取新的数据
   * 且不与旧的数据合并
   * @CAUTION 这会覆盖已经获取的数据！
   */
  const fetchNewData = async () => {
    await fetchMore?.({
      variables: {},
    });
  };

  return (
    <main className={`${style['main']}`}>
      <Header title='首页' />
      <NewPost fetchQuery={fetchNewData} />
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
          {/* {data.noteFeed.notes.map((item) => {
            return <Post key={item.id} {...item} />;
          })} */}
          <MemoPosts data={data} />
        </InfiniteScroll>
      ) : (
        <LoadError />
      )}
    </main>
  );
};

export default Home;
