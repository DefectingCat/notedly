import { useEffect } from 'react';
import Header from '../components/common/Header';
import { useQuery, gql } from '@apollo/client';
import useStore from '../store';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadError from '../components/common/LoadError';
import LoadingCard from '../components/common/LoadingCard';
import style from '../pages/home.module.scss';
import Post from '../components/posts/Post';
import { Notes } from './Home';

// Generated by https://quicktype.io

export interface MyNotes {
  myNotes: MyNotesClass;
}

export interface MyNotesClass {
  notes: Notes[];
  cursor: string;
  hasNextPage: boolean;
}

interface CursorVars {
  myNotesCursor: string;
}

const MY_NOTES = gql`
  query MY_NOTES($myNotesCursor: String) {
    myNotes(cursor: $myNotesCursor) {
      notes {
        id
        content
        author {
          id
          username
          email
          avatar
        }
        createdAt
        favoriteCount
        favoritedBy {
          id
          username
        }
        commentNum
      }
      cursor
      hasNextPage
    }
  }
`;

const MyNote: React.FC = () => {
  const { state, setUserState } = useStore();

  const { data, loading, error, fetchMore } = useQuery<MyNotes, CursorVars>(
    MY_NOTES
  );

  /**
   * 每次进入首页时
   * 恢复到上次浏览的位置
   * 防止过度滚动，只监听 state.scrolledTop
   */
  useEffect(() => {
    !loading && window.scrollTo(0, state.scrolledTop);
  }, [loading, state.scrolledTop]);

  let { myNotes, myCursor, myNext } = state;
  useEffect(() => {
    if (!myNotes) {
      if (data?.myNotes) {
        const { notes: apolloNotes } = data.myNotes;
        setUserState({
          ...state,
          myNotes: apolloNotes,
          myCursor: data.myNotes.cursor,
          myNext: data.myNotes.hasNextPage,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setUserState]);

  /**
   * fetchMoreData
   * 该函数用于滚动到底部加载新的数据
   * 用 cache.ts 判断并合并新的数据
   */
  const fetchMoreData = async () => {
    const { data: newData } = await fetchMore({
      variables: {
        myNotesCursor: myCursor,
      },
    });
    const { myNotes: myNewNotes } = newData as MyNotes;
    myNotes && (myNotes = [...myNotes, ...myNewNotes.notes]);
    setUserState({
      ...state,
      myNotes,
      myCursor: myNewNotes.cursor,
      myNext: myNewNotes.hasNextPage,
    });
  };

  return (
    <>
      <main className={`${style['main']}`}>
        <Header title='我的动态' />
        {error ? (
          <LoadError />
        ) : loading ? (
          <LoadingCard loading />
        ) : myNotes ? (
          <InfiniteScroll
            dataLength={myNotes.length}
            next={fetchMoreData}
            hasMore={myNext}
            loader={<LoadingCard loading />}
          >
            {myNotes.map((item) => (
              <Post key={item.id} {...item} />
            ))}
          </InfiniteScroll>
        ) : (
          <LoadError />
        )}
      </main>
    </>
  );
};

export default MyNote;
