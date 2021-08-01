import { createElement, ReactNode, useEffect, useState } from 'react';
import { Comment, Avatar, Tooltip, message } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import style from './postcomment.module.scss';
import { UserComment, Reply } from './CommentList';
import useStore from '../../store';
import { useMutation, gql } from '@apollo/client';
import NewComment from './NewComment';

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
  const { state } = useStore();
  const [showReply, setShowReply] = useState(false);

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

  const actions = [
    <Tooltip key='comment-basic-like' title='Like'>
      <span onClick={toFavo} className={style['comment-like']}>
        {createElement(favoed ? LikeFilled : LikeOutlined)}
        <span className={style['comment-like-action']}>{favoriteCount}</span>
      </span>
    </Tooltip>,
    <span key='comment-basic-reply-to' onClick={() => setShowReply(!showReply)}>
      回复
    </span>,
  ];

  return (
    <>
      <Comment
        actions={actions}
        author={`${author.username} ${
          toUser ? `@${toUser.username}` : ''
        } ${createdAt?.substr(0, 10)} ${createdAt?.substr(11, 8)}`}
        avatar={<Avatar src={author.avatar} alt={author.username} />}
        content={<p>{content}</p>}
      >
        {children}
      </Comment>
      {showReply ? (
        parentId ? (
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
        )
      ) : (
        void 0
      )}
    </>
  );
};

export default PostComment;
