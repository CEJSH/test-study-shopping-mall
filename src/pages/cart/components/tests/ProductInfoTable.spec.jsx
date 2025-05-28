import { screen, within } from '@testing-library/react';
import React from 'react';

import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';
import {
  mockUseCartStore,
  mockUseUserStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      6: {
        id: 6,
        title: 'Handmade Cotton Fish',
        price: 809,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and ...',
        images: ['', '', ''],
        count: 3,
      },
      7: {
        id: 7,
        title: 'Awesome Concrete Shirt',
        price: 442,
        description:
          'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport',
        images: ['', '', ''],
        count: 4,
      },
    },
  });
});
it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  await render(<ProductInfoTable />);
  const [firstItem, secondItem] = screen.getAllByRole('row');

  // 특정 요소내에서만 쿼리하고싶을 때 within사용하기
  expect(
    within(firstItem).getByText('Handmade Cotton Fish'),
  ).toBeInTheDocument();
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();

  expect(
    within(secondItem).getByText('Awesome Concrete Shirt'),
  ).toBeInTheDocument();
  expect(within(secondItem).getByRole('textbox')).toHaveValue('4');
  expect(within(secondItem).getByText('$1,768.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');

  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '5');

  // 2427 + 809 * 2 = 4045
  expect(screen.getByText('$4,045.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  const alertSpy = vi.fn();

  // window.alert -> alertSpy로 대체
  vi.stubGlobal('alert', alertSpy);

  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '1000');

  expect(alertSpy).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!');
});

it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [, secondItem] = screen.getAllByRole('row');

  const deleteButton = within(secondItem).getByRole('button');

  // 두번째 아이템이 존재하는지 확인한다.
  expect(screen.getByText('Awesome Concrete Shirt')).toBeInTheDocument();

  await user.click(deleteButton);

  // 주의할점: 여기서 getByText가 아닌 queryByText를 사용해야함
  // queryBy~~: 요소의 존재 유무 판단. 요소가 존재하지 않아도 에러 X
  expect(screen.queryByText('Awesome Concrete Shirt')).not.toBeInTheDocument();
});
