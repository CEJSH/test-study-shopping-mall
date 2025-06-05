import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다', async () => {
  await render(<TextField />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  expect(textInput).toBeInTheDocument();
});

it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test');

  expect(spy).toHaveBeenCalledWith('test');
});
