import { ChangeEvent, useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import style from './newpost.module.scss';
import { useMutation, gql } from '@apollo/client';
import useStore from '../../store';
import { useHistory } from 'react-router';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import cloneDeep from 'lodash/cloneDeep';

const { TextArea } = Input;

export interface PostCont {
  newNote: NewNote;
}

export interface NewNote {
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

interface PostVars {
  newNoteContent: string;
}

const NEW_POST = gql`
  mutation Mutation($newNoteContent: String!) {
    newNote(content: $newNoteContent) {
      id
      author {
        id
        username
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
    }
  }
`;

const NewPost = (): JSX.Element => {
  // textarea 输入内容
  const [draft, setDraft] = useState('');
  const { state, setUserState } = useStore();
  const history = useHistory();
  // textarea ref
  const text = useRef<TextAreaRef>(null);

  const handInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setDraft(target.value);
  };

  const [emitPost, { loading }] = useMutation<PostCont, PostVars>(NEW_POST);

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
      let { notes, myNotes } = state;
      const { data } = await emitPost({
        variables: { newNoteContent: draft },
      });
      data?.newNote.id && setDraft('');

      /**
       * 在成功发送后
       * 同时更新 Home 与 Profile 缓存的状态
       * 以达到更新首页数据的目的
       * 而不用重新发发送请求
       */
      if (notes || myNotes) {
        const deepNotes = cloneDeep(notes);
        const deepMyNotes = cloneDeep(myNotes);
        data && deepNotes?.unshift(data?.newNote);
        data && deepMyNotes?.unshift(data?.newNote);
        setUserState({ ...state, notes: deepNotes, myNotes: deepMyNotes });
      }
    } catch (e) {
      console.log(e);
      message.error('发送失败😲');
    }
  };

  return (
    <>
      <TextArea
        placeholder={`What's on your mind?`}
        autoSize={{ minRows: 3, maxRows: 6 }}
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
        loading={loading}
      >
        发射
      </Button>
    </>
  );
};

export default NewPost;
