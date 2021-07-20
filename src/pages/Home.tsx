import React from 'react';
import style from './home.module.scss';

function Home(): JSX.Element {
  return (
    <main className={`${style['main-body']}`}>
      <h2>Home!</h2>
    </main>
  );
}

export default Home;
