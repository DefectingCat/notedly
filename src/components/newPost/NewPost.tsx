import React from 'react';
import { Input, Button } from 'antd';
import style from './newpost.module.scss';

const { TextArea } = Input;

const NewPost = (): JSX.Element => {
  return (
    <div>
      <TextArea
        placeholder={`What's on your mind?`}
        autoSize={{ minRows: 2, maxRows: 6 }}
        className={style['main-input']}
      />
      <Button type='primary' shape='round'>
        发射
      </Button>
    </div>
  );
};

export default NewPost;
