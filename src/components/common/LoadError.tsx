import { Empty } from 'antd';
import errorImg from '../../assets/img/error.svg';

const LoadError: React.FC = () => {
  return (
    <>
      <Empty image={errorImg} description='加载失败' />
    </>
  );
};

export default LoadError;
