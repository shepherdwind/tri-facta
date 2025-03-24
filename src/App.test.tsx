import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders game title', () => {
    render(<App />);
    const titleElement = screen.getByText(/tri-FACTa!/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<App />);
    const subtitleElement = screen.getByText('数学卡牌游戏');
    expect(subtitleElement).toBeInTheDocument();
  });
});
