import React from 'react';
import { Card } from 'antd';
import style from './loadingcard.module.scss';

const LoadingCard = ({ loading }: { loading: boolean }): JSX.Element => {
  return (
    <>
      <Card className={style['loading-card']} loading={loading} hoverable />
    </>
  );
};

export default LoadingCard;
