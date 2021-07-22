import { InMemoryCache } from '@apollo/client';
import { NoteKeys } from './pages/Home';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // 首页的所有动态列表
        noteFeed: {
          keyArgs: false,

          /**
           * Apollo 分页合并数据方法
           * 主要用于合并 notes 数组
           * 配合实现数据无限滚动
           * @param existing 以及获取的数据
           * @param incoming 最新获取的数据
           * @returns
           */
          merge(
            existing: NoteKeys['noteFeed'],
            incoming: NoteKeys['noteFeed']
          ) {
            let notes: NoteKeys['noteFeed']['notes'] = [];

            if (existing && existing?.notes) {
              notes = notes.concat(existing.notes);
            }
            if (incoming && incoming?.notes) {
              notes = notes.concat(incoming.notes);
            }

            return { ...incoming, notes };
          },
        },
      },
    },
  },
});

export default cache;
