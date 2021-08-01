import { Card } from 'antd';
import style from './comment.module.scss';
import PostComment from './PostComment';
import NewComment from './NewComment';
import { useQuery, gql } from '@apollo/client';
import LoadError from '../common/LoadError';
import LoadingCard from '../common/LoadingCard';
import { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

interface Props {
  id: string;
}

export interface Comments {
  comments: CommentsClass;
}

export interface CommentsClass {
  comments: UserComment[];
  cursor: string;
  hasNextPage: boolean;
}

export interface UserComment {
  id: string;
  content: string;
  author: Author;
  favoriteCount: number;
  favoritedBy: FavoritedBy[];
  createdAt: string;
  reply: Reply[];
}

export interface Author {
  id: string;
  username: string;
  avatar: string;
}

export interface Reply {
  id: string;
  parent: string;
  content: string;
  author: Author;
  toUser: Author;
  createdAt: string;
  favoriteCount: number;
  favoritedBy: FavoritedBy[];
}

export interface FavoritedBy {
  id: string;
  username: string;
}

interface ComVars {
  // 当前 post 的 id
  commentsPost: string;
  // 一下次分页的游标
  commentsCursor?: string;
}

const GET_COMMENT = gql`
  query Query($commentsPost: ID!, $commentsCursor: String) {
    comments(post: $commentsPost, cursor: $commentsCursor) {
      comments {
        id
        content
        author {
          id
          username
          avatar
        }
        favoriteCount
        favoritedBy {
          id
          username
        }
        createdAt
        reply {
          id
          parent
          content
          createdAt
          author {
            id
            username
            avatar
          }
          toUser {
            id
            username
            avatar
          }
          favoriteCount
          favoritedBy {
            id
            username
          }
        }
      }
      cursor
      hasNextPage
    }
  }
`;

const CommentList = ({ id }: Props) => {
  const { data, loading, fetchMore } = useQuery<Comments, ComVars>(
    GET_COMMENT,
    {
      variables: {
        commentsPost: id,
      },
    }
  );

  const [comments, setComments] = useState<UserComment[]>();

  useEffect(() => {
    data && setComments(data.comments.comments);
  }, [data]);

  /**
   * 该方法用于给子组件 PostComment 点赞后更新 state
   * @param id 被点赞的评论的 id
   * @param favoriteCount 当前的点赞数量
   * @param favoritedBy 点赞的用户
   * @param isReply 是否是回复父组件
   */
  const updateComments = (
    id: string,
    favoriteCount?: number,
    favoritedBy?: FavoritedBy[],
    isReply?: boolean
  ) => {
    const deepCom = cloneDeep(comments);
    let replyCom: Reply | UserComment | undefined;
    if (isReply) {
      /**
       * 当回复父评论时
       * 在 reply 数组中寻找当前评论
       */
      const map = (item: UserComment) => {
        if (!replyCom) {
          replyCom = item.reply.find((item) => item.id === id);
          return;
        }
      };
      deepCom?.map(map);
    } else {
      /**
       * 若不是回复父评论
       * 直接查找 comment
       */
      replyCom = deepCom?.find((item) => item.id === id);
    }
    if (replyCom) {
      /**
       * @CAUTION 0 为 false
       */
      favoriteCount != null && (replyCom.favoriteCount = favoriteCount);
      favoritedBy && (replyCom.favoritedBy = favoritedBy);
    }
    setComments(deepCom);
  };

  const updateNewComment = (
    newComment: UserComment | Reply,
    isReply?: boolean,
    parentId?: string
  ) => {
    const deepCom = cloneDeep(comments);
    if (isReply) {
      /**
       * 当回复父评论时
       * 在 reply 数组中寻找当前评论
       */
      const map = (item: UserComment) => {
        if (item.id === parentId) {
          /**
           * @ASSERTION NewComment 组件没有对回复评论的评论结果进行区分
           * 导致他们的类型完全一样，但这没有影响
           * reply 数组内必须保持 Reply 类型
           * 他们二者其实是一样的
           */
          item.reply.push(newComment as Reply);
          console.log(item);
          return;
        }
      };
      deepCom?.map(map);
      setComments(deepCom);
    } else {
      // 这里一直都会是 false ，因为 newComment 根本没有 parent
      // 这也是上述需要使用断言的原因
      'parent' in newComment || deepCom?.unshift(newComment);
      setComments(deepCom);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingCard loading />
      ) : comments ? (
        <>
          <Card className={style['com-card']}>
            {comments.length ? (
              comments.map((item) => (
                <PostComment
                  key={item.id}
                  postComment={item}
                  updateComments={updateComments}
                  updateNewComment={updateNewComment}
                  postId={id}
                >
                  {item.reply.map((rep) => (
                    <PostComment
                      key={rep.id}
                      postComment={rep}
                      updateComments={updateComments}
                      updateNewComment={updateNewComment}
                      postId={id}
                      parentId={rep.parent}
                    />
                  ))}
                </PostComment>
              ))
            ) : (
              <span className={style['no-comment']}>快来说两句吧🎤</span>
            )}
          </Card>

          <Card className={style['com-card']}>
            <NewComment id={id} updateNewComment={updateNewComment} />
          </Card>
        </>
      ) : (
        <LoadError />
      )}
    </>
  );
};

export default CommentList;
