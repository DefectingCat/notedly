import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import App from '../App';
import { RecoilRoot } from 'recoil';

afterEach(cleanup);

it('should take a snapshot', () => {
  const { getByTestId } = render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );

  expect(getByTestId('navi-wrap')).toHaveTextContent('首页');
});
