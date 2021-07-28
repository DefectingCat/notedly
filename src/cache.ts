import { InMemoryCache } from '@apollo/client';

interface FetchData {
  notes: {
    __ref: string;
  }[];
}

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
           * @param existing 已经获取的数据
           * @param incoming 最新获取的数据
           * @returns
           */
          merge(existing: FetchData, incoming: FetchData) {
            let notes: FetchData['notes'] = [];

            /**
             * 在发布新的 post 时
             * 会尝试重新获取新的 post list
             * 这时会发送一次一模一样的请求
             * 所以需要判断数据是否重复
             * 如果重复则不合并
             * @ID ID 为 mongo ObjectID 在当前文档中可以保持唯一
             */
            if (existing && existing?.notes) {
              const someOne = existing.notes[0];
              const isTure = incoming.notes.find(
                (item) => item.__ref === someOne.__ref
              );
              if (isTure) return { ...incoming };
            }

            if (existing && existing?.notes) {
              notes = notes.concat(existing.notes);
            }
            if (incoming && incoming?.notes) {
              notes = notes.concat(incoming.notes);
            }

            return { ...incoming, notes };
          },
        },
        // 我的动态列表
        myNotes: {
          keyArgs: false,

          /**
           * Apollo 分页合并数据方法
           * 主要用于合并 notes 数组
           * @param existing 已经获取的数据
           * @param incoming 最新获取的数据
           * @returns
           */
          merge(existing: FetchData, incoming: FetchData) {
            let notes: FetchData['notes'] = [];

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
