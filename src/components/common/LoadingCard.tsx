import { Card } from 'antd';
import style from './loadingcard.module.scss';

const LoadingCard: React.FC<{ loading: boolean }> = ({
  loading,
}: {
  loading: boolean;
}) => {
  return (
    <>
      <Card className={style['loading-card']} loading={loading} />
    </>
  );
};

export default LoadingCard;
