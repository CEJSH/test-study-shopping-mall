import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

// // my-class란 class가 항상 적용된 컴포넌트를 렌더링
// beforeEach(async () => {
//   await render(<TextField placeholder="111" />);
// });
it('className prop으로 설정한 css class가 적용된다', async () => {
  await render(<TextField className="my-class" />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  screen.debug();

  expect(textInput).toHaveClass('my-class');
});

//  it -> test 함수의 alias
// describe -> 테스트들 그루핑하는 함수, 독립적인 설정 정의

describe('placeholder', () => {
  it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다.', async () => {
    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    screen.debug();

    expect(textInput).toBeInTheDocument();
    // 단언(assertion) -> 테스트가 통과하기 위한 조건 -> 검증 실행 -> matcher 사용
  });
  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder="상품명을 입력해 주세요" />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요');

    screen.debug();

    expect(textInput).toBeInTheDocument();
  });
});

it('text입력시 onChange prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn(); // 스파이 함수
  // 스파이 함수: 테스트 코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지 어떤 값을 반환하는지
  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test');

  expect(spy).toHaveBeenCalledWith('test');
});

it('엔터를 입력하면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onEnter={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test{Enter}');

  expect(spy).toHaveBeenCalledWith('test');
});

it('focus시 border onFocus prop으로 등록한 함수가 호출된다', async () => {
  // 포커스 활성화
  // 탭 키로 인풋 요소로 포커스 이동
  // 인풋 요소를 클릭했을 때 => 가장 보편적이지 않을까
  // textInput.focus()로 직접 발생
  const spy = vi.fn();
  const { user } = await render(<TextField onFocus={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.click(textInput);

  expect(spy).toHaveBeenCalled(spy);
});
it('focus시 border 스타일이 변경된다', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onFocus={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.click(textInput);

  expect(textInput).toHaveStyle({
    borderWidth: 2,
    borderColor: 'rgb(25, 118, 210)',
  });
});
