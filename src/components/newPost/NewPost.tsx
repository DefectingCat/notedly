import { ChangeEvent, useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import style from './newpost.module.scss';
import { useMutation, gql } from '@apollo/client';
import useStore from '../../store';
import { useHistory } from 'react-router';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import cloneDeep from 'lodash/cloneDeep';
// import IconFont from '../common/icon/NotedlyIcons';
// import useAxios from '../../hooks/useAxios';

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

const NewPost: React.FC = () => {
  // textarea 输入内容
  const [draft, setDraft] = useState('');
  const { state, setUserState } = useStore();
  const history = useHistory();
  // textarea ref
  const text = useRef<TextAreaRef>(null);

  // const axios = useAxios();
  // 上传进度
  /*   const [progress, setProgress] = useState(0);

  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: { loaded: number; total: number }) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append('file', file);
    try {
      const res = await axios.post('', fmData, config);
      onSuccess('Ok');
      console.log('server res: ', res);
    } catch (err) {
      console.log('Eroor: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  }; */

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
        if (data) {
          deepNotes?.unshift(data?.newNote);
          deepMyNotes?.unshift(data?.newNote);
        }
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

      {/*       <Upload customRequest={handleUpload}>
        <Button shape='round' className={style['emit-btn']}>
          <IconFont type='icon-tupian' />
        </Button>
      </Upload> */}
    </>
  );
};

export default NewPost;
