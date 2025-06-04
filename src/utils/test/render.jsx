import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';

export default async (component, options = {}) => {
  const { routerProps } = options;
  const user = userEvent.setup();

  // https://tanstack.com/query/v4/docs/react/guides/testing
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ turns retries off (쿼리 실패시 탠스택에서 기본적으로 3번 재시도를 하는 것을 해제-> 테스트 실행시간 초과 가능성)
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests
      error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
    },
  });

  return {
    user,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>{component}</MemoryRouter>
        <Toaster />
      </QueryClientProvider>,
    ),
  };
};
