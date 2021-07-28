import Header from '../components/common/Header';
import { useMutation, gql } from '@apollo/client';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import style from './login.module.scss';
import { useHistory } from 'react-router-dom';
import useStore from '../store';

interface LoginToken {
  signIn: string;
}

interface LoginVars {
  username: string;
  password: string;
}

interface FormVal {
  username: string;
  password: string;
  remember: boolean;
}

const LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    signIn(username: $username, password: $password)
  }
`;

const Login = (): JSX.Element => {
  const { state, setUserState } = useStore();

  const [login, { loading }] = useMutation<LoginToken, LoginVars>(LOGIN);

  // 表单对象 主要用于重置表单
  const [loginForm] = Form.useForm();

  const history = useHistory();

  const onFinish = async (values: FormVal) => {
    const { username, password, remember } = values;
    try {
      const { data } = await login({
        variables: { username, password },
      });
      if (data?.signIn) {
        remember && window.localStorage.setItem('token', data.signIn);
        setUserState({ ...state, isLoggedIn: true });
      }
      message.success('登录成功🎉');
      history.push('/');
    } catch (e) {
      console.log(e);
      message.error('登录失败😲');
    } finally {
      loginForm.resetFields();
    }
  };

  return (
    <>
      <Header title='登录' />
      <Form
        name='normal_login'
        className={style.wrapper}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={loginForm}
      >
        <Form.Item
          name='username'
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Username'
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
            shape='round'
            loading={loading}
          >
            登录
          </Button>{' '}
          <Button type='link' onClick={() => history.push('/signup')}>
            现在加入!
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
