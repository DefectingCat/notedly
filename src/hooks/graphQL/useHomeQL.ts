import { useQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import useStore from '../../store';

export interface Notes {
  id: string;
  author: Author;
  createdAt: string;
  content: string;
  favoriteCount: number;
  favoritedBy: FavoritedBy[];
  commentNum: number;
}
export interface FavoritedBy {
  id: string;
  username: string;
}

export interface Author {
  id: string;
  username: string;
  email: string;
  avatar: string;
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

export const GET_NOTES = gql`
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
        commentNum
      }
      cursor
      hasNextPage
    }
  }
`;

const useHomeQL = () => {
  const { data, loading, error, fetchMore } = useQuery<NoteKeys, CursorVars>(
    GET_NOTES
  );

  const { state, setUserState } = useStore();

  /**
   * 每次进入首页时
   * 恢复到上次浏览的位置
   * 防止过度滚动，只监听 state.scrolledTop
   */
  useEffect(() => {
    !loading && window.scrollTo(0, state.scrolledTop);
  }, [loading, state.scrolledTop]);

  /**
   * 将 Apollo 请求到的数据保存到状态管理
   */
  let { notes, homeCursor, homeNext } = state;
  useEffect(() => {
    if (!notes) {
      if (data?.noteFeed) {
        const { notes: apolloNotes } = data.noteFeed;
        setUserState({
          ...state,
          notes: apolloNotes,
          homeCursor: data.noteFeed.cursor,
          homeNext: data.noteFeed.hasNextPage,
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
      variables: { noteFeedCursor: homeCursor },
    });
    const { noteFeed } = newData as NoteKeys;
    notes && (notes = [...notes, ...noteFeed.notes]);
    setUserState({
      ...state,
      notes,
      homeCursor: noteFeed.cursor,
      homeNext: noteFeed.hasNextPage,
    });
  };

  return { loading, error, fetchMoreData, notes, homeNext };
};

export default useHomeQL;
