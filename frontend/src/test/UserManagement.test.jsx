import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserManagement from '../Pages/UserManagement';
import axiosInstance from '../utils/axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);
const mockAxios = new MockAdapter(axiosInstance);


jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    dismiss: jest.fn(),
  },
  ToastContainer: () => null,
}));

describe('UserManagement Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        isAuthenticated: true,
        role: 'admin',
      },
    });

    store.dispatch = jest.fn();
    mockAxios.reset();
  });

  it('renders UserManagement without crashing', () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('fetches and displays users', async () => {
    const usersData = [
      { id: 2, username: 'Anurag k', first_name: 'Anurag', last_name: 'k', email: 'anuragremeshank@gmail.com', is_active: true },
      { id: 4, username: 'Anurag K', first_name: 'Anurag', last_name: 'K', email: 'anurag37ak@gmail.com', is_active: true },
    ];

    mockAxios.onGet('/account/').reply(200, usersData);

    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Anurag k')).toBeInTheDocument();
      expect(screen.getByText('Anurag K')).toBeInTheDocument();
    });
  });

  it('searches users based on the input', async () => {
    const usersData = [
      { id: 2, username: 'Anurag k', first_name: 'Anurag', last_name: 'k', email: 'anuragremeshank@gmail.com', is_active: true },
      { id: 4, username: 'Anurag K', first_name: 'Anurag', last_name: 'K', email: 'anurag37ak@gmail.com', is_active: true },
    ];

    mockAxios.onGet('/account/').reply(200, usersData);

    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Anurag k')).toBeInTheDocument();
      expect(screen.getByText('Anurag K')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search users...'), { target: { value: 'anuragremeshank' } });

    await waitFor(() => {
      expect(screen.getByText('Anurag k')).toBeInTheDocument();
      expect(screen.queryByText('Anurag K')).not.toBeInTheDocument();
    });
  });

  it('blocks a user and shows success message', async () => {
    const usersData = [
      { id: 2, username: 'Anurag k', first_name: 'Anurag', last_name: 'k', email: 'anuragremeshank@gmail.com', is_active: true },
    ];

    mockAxios.onGet('/account/').reply(200, usersData);
    mockAxios.onPatch('/account/block-user/2/').reply(200);

    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Anurag k')).toBeInTheDocument();
    });

    const blockButton = screen.getByRole('button', { name: /block/i });
    fireEvent.click(blockButton);

    const { toast } = jest.requireMock('react-toastify');
    const infoCallback = toast.info.mock.calls[0][0];
    const yesButton = infoCallback.props.children[1].props.children[0];
    yesButton.props.onClick();

    await waitFor(() => {
      expect(mockAxios.history.patch[0].url).toBe('/account/block-user/2/');
      expect(toast.success).toHaveBeenCalledWith('User blocked successfully!');
    });
  });

  it('handles error when blocking a user', async () => {
    const usersData = [
      { id: 2, username: 'Anurag k', first_name: 'Anurag', last_name: 'k', email: 'anuragremeshank@gmail.com', is_active: true },
    ];

    mockAxios.onGet('/account/').reply(200, usersData);
    mockAxios.onPatch('/account/block-user/2/').reply(500);

    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Anurag k')).toBeInTheDocument();
    });

    const blockButton = screen.getByRole('button', { name: /block/i });
    fireEvent.click(blockButton);

  
    const { toast } = jest.requireMock('react-toastify');
    const infoCallback = toast.info.mock.calls[0][0];
    const yesButton = infoCallback.props.children[1].props.children[0];
    yesButton.props.onClick();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error blocking/unblocking user.');
    });
  });
});