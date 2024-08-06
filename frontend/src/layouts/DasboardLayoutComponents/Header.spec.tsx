import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './Header';
import UserContext from '../../context/users';
import * as cookiesModule from '../../utils/cookies';
import { UserData } from '../../interfaces/userInfo';

// Mock the react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock the cookies utility functions
vi.mock('../../utils/cookies', () => ({
  getUserCookie: vi.fn(),
  removeUserCookie: vi.fn(),
}));

const mockUser: UserData = {
  name: 'Test User',
  id: 0,
  email: '',
  password: '',
  gender: ''
};

const mockSetUser = vi.fn();

const renderHeader = (user: UserData | null = mockUser) => {
  return render(
    <Router>
      <UserContext.Provider value={{ user, setUser: mockSetUser }}>
        <Header user={user} />
      </UserContext.Provider>
    </Router>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header with user name', () => {
    renderHeader();
    expect(screen.getByText('Pokemon Project')).toBeDefined();
    expect(screen.getByText(mockUser.name)).toBeDefined();
  });

  it('sets user from cookie if local user is null', () => {
    const cookieUser: UserData = {
      name: 'Cookie User',
      id: 0,
      email: '',
      password: '',
      gender: ''
    };
    vi.mocked(cookiesModule.getUserCookie).mockReturnValue(cookieUser);

    renderHeader(null);

    expect(mockSetUser).toHaveBeenCalledWith(cookieUser);
  });
});