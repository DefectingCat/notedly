import { Empty } from 'antd';
import errorImg from '../../assets/img/error.svg';

const LoadError = (): JSX.Element => {
  return (
    <>
      <Empty image={errorImg} description='加载失败' />
    </>
  );
};

export default LoadError;
