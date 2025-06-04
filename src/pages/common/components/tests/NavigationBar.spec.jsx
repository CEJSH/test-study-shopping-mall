import { screen, within } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import NavigationBar from '@/pages/common/components/NavigationBar';
import {
  mockUseUserStore,
  mockUseCartStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';
import { server } from '@/utils/test/setupTests';

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
    useLocation: () => ({
      pathname: 'pathname',
    }),
  };
});

it('"Wish Mart" 텍스트 로고을 클릭할 경우 "/" 경로로 navigate가 호출된다.', async () => {
  const { user } = await render(<NavigationBar />);

  await user.click(screen.getByText('Wish Mart'));
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/');
});

describe('로그인이 된 경우', () => {
  // 로그인 상태와 장바구니 상품에 대한 스토어 모킹
  const userId = 10;

  beforeEach(() => {
    // 기존 handlers.js 응답 -> use 함수 내에 응답을 기준으로 테스트 실행
    // test가 완료된 후 기존 handler.js의 응답을 바라보도록 설정해야 하지 않을까?
    server.use(
      rest.get('/user', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            email: 'maria@mail.com',
            id: userId,
            name: 'Maria',
            password: '12345',
          }),
        );
      }),
    );
    mockUseUserStore({ isLogin: true });

    const cart = {
      6: {
        id: 6,
        title: 'Handmade Cotton Fish',
        price: 100,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and',
        images: ['', '', ''],
        count: 3,
      },
      7: {
        id: 7,
        title: 'Awesome Concrete Shirt',
        price: 50,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and',
        images: ['', '', ''],
        count: 4,
      },
    };

    mockUseCartStore({ cart });
  });

  // 장바구니 및 로그인 여부 외에 사용자 정보 필요
  it('장바구니(담긴 상품 수와 버튼)와 로그아웃 버튼(사용자 이름: "Maria")이 노출된다.', async () => {
    await render(<NavigationBar />);

    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Maria' }),
    ).toBeInTheDocument();
  });

  it('장바구니 버튼 클릭 시 "/cart" 경로로 navigate를 호출한다.', async () => {
    const { user } = await render(<NavigationBar />);

    const cartIcon = screen.getByTestId('cart-icon');
    await user.click(cartIcon);

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
  });

  // 모두 모달이 렌더링되는 동작과 관련이 있으므로 describe로 한 번더 그룹핑
  describe('로그아웃 버튼(사용자 이름: "Maria")을 클릭하는 경우', () => {
    let userEvent;
    beforeEach(async () => {
      const { user } = await render(<NavigationBar />);
      userEvent = user;

      const logoutBtn = await screen.findByRole('button', { name: 'Maria' });
      await user.click(logoutBtn);
    });

    it('모달이 렌더링되며, 모달 내에 "로그아웃 하시겠습니까?" 텍스트가 렌더링된다.', () => {
      const dialog = screen.getByRole('dialog');

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        within(dialog).getByText('로그아웃 하시겠습니까?'),
      ).toBeInTheDocument();
    });

    it('모달의 확인 버튼을 누르면, 로그아웃이 되며, 모달이 사라진다.', async () => {
      const confirmBtn = screen.getByRole('button', { name: '확인' });

      await userEvent.click(confirmBtn);

      expect(
        screen.getByRole('button', { name: '로그인' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Maria' }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('모달의 취소 버튼을 누르면, 모달이 사라진다.', async () => {
      const cancelBtn = screen.getByRole('button', { name: '취소' });

      await userEvent.click(cancelBtn);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});

describe('로그인이 안된 경우', () => {
  it('로그인 버튼이 노출되며, 클릭 시 "/login" 경로와 현재 pathname인 "pathname"과 함께 navigate를 호출한다.', async () => {
    const { user } = await render(<NavigationBar />);
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();

    const loginBtn = screen.getByRole('button', { name: '로그인' });
    await user.click(loginBtn);

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login', {
      state: { prevPath: 'pathname' },
    });
  });
});
