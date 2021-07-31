import { Form, Button, Input } from 'antd';
import style from './newcomment.module.scss';

const { TextArea } = Input;

const NewComment = () => {
  return (
    <>
      <Form.Item>
        <TextArea
          placeholder={`What's on your mind?`}
          autoSize={{ minRows: 3, maxRows: 6 }}
          allowClear
          className={style['main-input']}
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType='submit'
          type='primary'
          shape='round'
          className={style['emit-btn']}
        >
          发射评论
        </Button>
      </Form.Item>
    </>
  );
};

export default NewComment;
