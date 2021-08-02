import { Form, Button, Input, message } from 'antd';
import style from './newcomment.module.scss';
import { useMutation, gql } from '@apollo/client';
import { ChangeEvent, useRef, useState } from 'react';
import { UserComment } from './CommentList';
import useStore from '../../store';
import { TextAreaRef } from 'antd/lib/input/TextArea';

const { TextArea } = Input;

interface Props {
  // 当前文章的 id
  id: string;
  updateNewComment: (
    newComment: UserComment,
    isReply?: boolean | undefined,
    parentId?: string
  ) => void;
  isReply?: boolean;
  toUserId?: string;
  parentId?: string;
  closeText?: () => void;
}

interface NewCom {
  newComment: UserComment;
}

interface NewVars {
  // 新评论的内容
  newCommentContent: string;
  // 被评论的文章的 id
  newCommentPost: string;
  // 被回复的评论的 id
  newCommentReply?: string;
  // 被回复的用户
  newCommentTo?: string;
}

const NEW_COM = gql`
  mutation NewCommentMutation(
    $newCommentContent: String!
    $newCommentPost: ID!
    $newCommentReply: ID
    $newCommentTo: ID
  ) {
    newComment(
      content: $newCommentContent
      post: $newCommentPost
      reply: $newCommentReply
      to: $newCommentTo
    ) {
      id
      content
      parent
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
  }
`;

const NewComment = ({
  id,
  updateNewComment,
  isReply,
  toUserId,
  parentId,
  closeText,
}: Props) => {
  // textarea 输入内容
  const [draft, setDraft] = useState('');
  const { state } = useStore();

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setDraft(target.value);
  };

  // textarea ref
  const text = useRef<TextAreaRef>(null);

  const [emitPost, { loading }] = useMutation<NewCom, NewVars>(NEW_COM);

  const newPost = async () => {
    if (!state.isLoggedIn) {
      message.warn('先登录哦🎁');
      return;
    }
    if (!draft) {
      message.warn('说点什么吧📢');
      text.current?.focus();
      return;
    }
    try {
      if (isReply) {
        const { data } = await emitPost({
          variables: {
            newCommentContent: draft,
            newCommentPost: id,
            newCommentReply: parentId,
            newCommentTo: toUserId,
          },
        });
        data?.newComment.id && setDraft('');
        data && updateNewComment(data.newComment, true, parentId);
      } else {
        const { data } = await emitPost({
          variables: { newCommentContent: draft, newCommentPost: id },
        });
        data?.newComment.id && setDraft('');
        data && updateNewComment(data.newComment);
      }
      // 关闭
      closeText?.();
    } catch (e) {
      console.log(e);
      message.error('发送失败😲');
    } finally {
    }
  };

  return (
    <>
      <Form.Item>
        <TextArea
          placeholder={`What's on your mind?`}
          autoSize={{ minRows: 3, maxRows: 6 }}
          allowClear
          className={style['main-input']}
          value={draft}
          onChange={handleInput}
          ref={text}
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType='submit'
          type='primary'
          shape='round'
          className={style['emit-btn']}
          onClick={newPost}
          loading={loading}
        >
          发射评论
        </Button>
      </Form.Item>
    </>
  );
};

export default NewComment;
