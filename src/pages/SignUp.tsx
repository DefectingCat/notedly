import React from 'react';
import { Form, Input, Button, message } from 'antd';
import Header from '../components/common/Header';
import style from './signup.module.scss';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from 'react-router-dom';

export interface SignUpToken {
  signUp: string;
}

interface SignUpVars {
  username: string;
  email: string;
  password: string;
}

const SIGN_UP = gql`
  mutation SignUpMutation(
    $username: String!
    $email: String!
    $password: String!
  ) {
    signUp(username: $username, email: $email, password: $password)
  }
`;

interface FormVal {
  'c-password': string;
  email: string;
  password: string;
  username: string;
}

const SignUp = (): JSX.Element => {
  const [signUp, { loading }] = useMutation<SignUpToken, SignUpVars>(SIGN_UP, {
    onCompleted: (data) => {
      // 持久化 token
      window.localStorage.setItem('token', data.signUp);
    },
  });

  // 表单对象 主要用于重置表单
  const [signUpForm] = Form.useForm();

  const history = useHistory();

  /**
   * 表单回调
   * 调用此方法说明表单验证已经通过
   * 在这里发送 GrapQL Mutation
   * @param values 表单数据
   */
  const onFinish = async (values: FormVal) => {
    const { username, email, password } = values;
    try {
      await signUp({
        variables: { username, email, password },
      });
      message.success('注册成功🎉');
      history.push('/');
    } catch (e) {
      console.log(e);
      message.error('注册失败😲');
    } finally {
      signUpForm.resetFields();
    }
  };

  /**
   * 表单验证不通过回调
   * @param errorInfo
   */
  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Header title='注册' />
      <Form
        name='signup'
        form={signUpForm}
        labelCol={{ span: 4 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={style.wrapper}
      >
        <Form.Item
          label='用户名'
          name='username'
          rules={[
            { required: true },
            () => ({
              validator(_, value: string) {
                if (value.length < 4)
                  return Promise.reject(new Error('不能太短！'));
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder='用户名可以用来登录' />
        </Form.Item>

        <Form.Item
          label='邮箱'
          name='email'
          rules={[{ required: true, message: '请输入邮箱' }]}
        >
          <Input type='email' placeholder='邮箱必须唯一' />
        </Form.Item>

        <Form.Item
          label='密码'
          name='password'
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='确认密码'
          name='c-password'
          rules={[
            { required: true, message: '请输入密码' },
            ({ getFieldValue }) => ({
              validator(_, value: string) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码不一致！'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            shape='round'
            loading={loading}
          >
            注册
          </Button>
          Or{' '}
          <a href='' onClick={() => history.push('/login')}>
            现在登录!
          </a>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUp;
