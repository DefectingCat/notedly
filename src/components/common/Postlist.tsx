import type { NoteKeys, Notes } from '../../pages/Home';
import React from 'react';
import Post from '../posts/Post';
import { Me } from '../../pages/Profile';

/**
 * 该组件是根据数据遍历显示 Post 卡片
 * Post 列表会保留记忆滚动的位置
 * 会导致切换时大面积的重复渲染
 * @param props
 * @returns
 */
const Posts = (props: { data: NoteKeys } | { data: Me }) => {
  let notes;
  if ('noteFeed' in props.data) {
    ({ notes } = props.data.noteFeed);
  } else {
    ({ notes } = props.data.me);
  }
  const map = (item: Notes) => <Post key={item.id} {...item} />;
  return <>{notes.map(map)}</>;
};

/**
 * @CAUTION 过早优化！
 */
// const MemoPosts = React.memo(Posts);

export default Posts;
