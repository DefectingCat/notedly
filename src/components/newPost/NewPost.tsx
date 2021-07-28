import { ChangeEvent, useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import style from './newpost.module.scss';
import { useMutation, gql } from '@apollo/client';
import useStore from '../../store';
import { useHistory } from 'react-router';
import { TextAreaRef } from 'antd/lib/input/TextArea';

const { TextArea } = Input;

interface Props {
  fetchQuery: () => Promise<void>;
}

export interface PostValue {
  newNote: NewNote;
}

export interface NewNote {
  id: string;
  content: string;
  author: Author;
}

export interface Author {
  id: string;
  username: string;
}

interface PostVars {
  newNoteContent: string;
}

const NEW_POST = gql`
  mutation Mutation($newNoteContent: String!) {
    newNote(content: $newNoteContent) {
      id
      content
      author {
        id
        username
      }
    }
  }
`;

const NewPost = (props: Props): JSX.Element => {
  const [draft, setDraft] = useState('');
  const { state } = useStore();
  const history = useHistory();
  const text = useRef<TextAreaRef>(null);

  const handInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setDraft(target.value);
  };

  const [emitPost] = useMutation<PostValue, PostVars>(NEW_POST);

  const newPost = async () => {
    if (!state.isLoggedIn) {
      message.warn('先登录哦🎁');
      history.push('/login');
      return;
    }
    if (!draft) {
      message.warn('说点什么吧📢');
      text.current?.focus();
      return;
    }
    try {
      const { data } = await emitPost({
        variables: { newNoteContent: draft },
      });
      data?.newNote.id && setDraft('');
      props.fetchQuery(); // 重新获取数据
    } catch (e) {
      console.log(e);
      message.error('发送失败😲');
    }
  };

  return (
    <>
      <TextArea
        placeholder={`What's on your mind?`}
        autoSize={{ minRows: 2, maxRows: 6 }}
        className={style['main-input']}
        onChange={handInput}
        ref={text}
        allowClear
        value={draft}
      />
      <Button
        type='primary'
        shape='round'
        className={style['emit-btn']}
        onClick={newPost}
      >
        发射
      </Button>
    </>
  );
};

export default NewPost;
