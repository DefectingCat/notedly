import { createElement, ReactNode, useEffect, useState } from 'react';
import { Comment, Avatar, Tooltip, message } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import style from './postcomment.module.scss';
import { UserComment, Reply } from './CommentList';
import useStore from '../../store';
import { useMutation, gql } from '@apollo/client';
import NewComment from './NewComment';
import parseTime from '../../hooks/util/parseTime';
import ReactMarkdown from 'react-markdown';

interface Props {
  postComment: UserComment | Reply;
  updateComments: (
    id: string,
    favoriteCount?: number,
    favoritedBy?: FavoritedBy[],
    isReply?: boolean
  ) => void;
  updateNewComment: (
    newComment: UserComment,
    isReply?: boolean | undefined,
    parentId?: string
  ) => void;
  postId: string;
  parentId?: string;
  children?: ReactNode;
}

export interface FavoRes {
  favoriteComment: FavoriteComment;
}

export interface FavoriteComment {
  id: string;
  favoriteCount: number;
  favoritedBy: FavoritedBy[];
}

export interface FavoritedBy {
  id: string;
  username: string;
}

interface FavoVars {
  favoriteCommentId: string;
  favoriteCommentIsReply?: boolean;
}

const FAVO_QL = gql`
  mutation FavoriteCommentMutation(
    $favoriteCommentId: ID!
    $favoriteCommentIsReply: Boolean
  ) {
    favoriteComment(id: $favoriteCommentId, isReply: $favoriteCommentIsReply) {
      id
      favoriteCount
      favoritedBy {
        id
        username
      }
    }
  }
`;

const PostComment = ({
  postComment,
  updateComments,
  updateNewComment,
  postId,
  parentId,
  children,
}: Props) => {
  const { state, setUserState } = useStore();
  const [showReply, setShowReply] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  // 解构 props
  const { id, author, content, favoriteCount, favoritedBy, createdAt } =
    postComment;

  let toUser: Reply['toUser'] | null = null;
  // 如果 toUser 存在，则这是一条回复的评论
  if ('toUser' in postComment) ({ toUser } = postComment);

  /**
   * 根据当前登录用户
   * 判断是当前用户是否已经点赞
   */
  const [favoed, setFavoed] = useState(false);
  useEffect(() => {
    setFavoed(!!favoritedBy.find((item) => item.id === state.user.id));
  }, [favoritedBy, state.user.id]);

  /**
   * 点赞 Mutation
   */
  const [favo] = useMutation<FavoRes, FavoVars>(FAVO_QL);

  const toFavo = async () => {
    try {
      let favoriteCount, favoritedBy;
      if (toUser) {
        const { data } = await favo({
          variables: { favoriteCommentId: id, favoriteCommentIsReply: true },
        });

        data && ({ favoriteCount, favoritedBy } = data.favoriteComment);
        updateComments(id, favoriteCount, favoritedBy, true);
      } else {
        const { data } = await favo({
          variables: { favoriteCommentId: id },
        });

        data && ({ favoriteCount, favoritedBy } = data.favoriteComment);
        updateComments(id, favoriteCount, favoritedBy);
      }
    } catch (e) {
      console.log(e);
      message.error('点赞失败😲');
    }
  };

  /**
   * 该方法用于传递给 NewComment
   * 成功发送评论后关闭评论框
   */
  const closeText = () => {
    setShowReply(false);
  };

  /**
   * 点击【回复】按钮事件
   * 首先将 isSelf 设置为 true
   * 表明本次是当前组件打开回复框
   * 并利用状态管理通知其他组件
   */
  const handleText = () => {
    setIsSelf(true);
    setUserState({ ...state, openRely: true });
    setShowReply(!showReply);
  };

  /**
   * 其他组件没有被点击【回复】按钮
   * 所以 isSelf 为 false
   * 接收到状态管理的变化时
   * 就检查自身是否开启了回复框
   * 并关闭
   */
  useEffect(() => {
    if (!isSelf && showReply && state.openRely) {
      closeText();
    }
    setIsSelf(false);
    setUserState({ ...state, openRely: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.openRely]);

  const actions = [
    <Tooltip key='comment-basic-like' title='Like'>
      <span onClick={toFavo} className={style['comment-like']}>
        {createElement(favoed ? LikeFilled : LikeOutlined)}
        <span className={style['comment-like-action']}>{favoriteCount}</span>
      </span>
    </Tooltip>,
    <span key='comment-basic-reply-to' onClick={handleText}>
      回复
    </span>,
  ];

  return (
    <>
      <Comment
        actions={actions}
        author={`${author.username} ${
          toUser ? `@${toUser.username}` : ''
        } ${parseTime(createdAt)}`}
        avatar={<Avatar src={author.avatar} alt={author.username} />}
        content={
          <p className='markdown-body'>
            <ReactMarkdown>{content}</ReactMarkdown>
          </p>
        }
      >
        {children}
      </Comment>
      {showReply ? (
        <div className={style['reply-text']}>
          {parentId ? (
            <NewComment
              id={postId}
              updateNewComment={updateNewComment}
              isReply
              toUserId={author.id}
              parentId={parentId}
              closeText={closeText}
            />
          ) : (
            <NewComment
              id={postId}
              updateNewComment={updateNewComment}
              isReply
              toUserId={author.id}
              parentId={id}
              closeText={closeText}
            />
          )}
        </div>
      ) : (
        void 0
      )}
    </>
  );
};

export default PostComment;
