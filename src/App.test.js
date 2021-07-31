import { render, act } from '@testing-library/react';
import App from './App';

test('check grid size 1', () => {
  const { container } = render(<App />);
  act(() => {
    global.innerWidth = 500;
    global.innerHeight = 2000;
    global.dispatchEvent(new Event('resize'));
  });

  const grid = container.querySelector('div[style="--nb-columns: 11; --nb-rows: 45;"]');

  expect(grid).toBeInTheDocument();
});

test('check grid size 2', () => {
  const { container } = render(<App />);
  act(() => {
    global.innerWidth = 2000;
    global.innerHeight = 500;
    global.dispatchEvent(new Event('resize'));
  });

  const grid = container.querySelector('div[style="--nb-columns: 45; --nb-rows: 11;"]');

  expect(grid).toBeInTheDocument();
});