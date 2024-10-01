
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import Dashboard from '../Pages/Dashboard';
import { fetchWeatherData } from '../features/weatherSlice';

jest.mock('../features/weatherSlice', () => ({
  fetchWeatherData: jest.fn((location) => async (dispatch) => {
    dispatch({ type: 'weather/fetchWeatherStart' });
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch({ 
        type: 'weather/fetchWeatherSuccess', 
        payload: {
          city: { name: 'Test City' },
          list: [
            {
              dt: 1625097600,
              main: { temp: 25, humidity: 60 },
              wind: { speed: 5 },
              weather: [{ description: 'clear sky' }],
            },
          ],
        }
      });
    } catch (error) {
      dispatch({ type: 'weather/fetchWeatherFailure', payload: error.message });
    }
  }),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderWithProviders = (ui, { initialState, store = mockStore(initialState), ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <Router>
        {children}
      </Router>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('Dashboard Component', () => {
  let store;
  const initialState = {
    auth: { user: 'TestUser' },
    weather: {
      data: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    fetchWeatherData.mockClear();
  });

  test('renders dashboard with user welcome message', () => {
    renderWithProviders(<Dashboard />, { store });
    expect(screen.getByText(/Welcome back, TestUser!/i)).toBeInTheDocument();
  });

  test('fetches weather data on component mount', async () => {
    renderWithProviders(<Dashboard />, { store });
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({ type: 'weather/fetchWeatherStart' });
      expect(actions).toContainEqual(expect.objectContaining({ 
        type: 'weather/fetchWeatherSuccess',
        payload: expect.any(Object)
      }));
    });
  });

  test('allows user to search for a city', async () => {
    renderWithProviders(<Dashboard />, { store });
    const input = screen.getByPlaceholderText('Enter city name');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetchWeatherData).toHaveBeenCalledWith('London');
    });
  });

  test('displays loading state', () => {
    const loadingState = {
      ...initialState,
      weather: { ...initialState.weather, loading: true },
    };
    const loadingStore = mockStore(loadingState);
    renderWithProviders(<Dashboard />, { store: loadingStore });
    expect(screen.getByText(/Loading weather data.../i)).toBeInTheDocument();
  });

  test('displays error message when fetch fails', () => {
    const errorState = {
      ...initialState,
      weather: { ...initialState.weather, error: 'API Error' },
    };
    const errorStore = mockStore(errorState);
    renderWithProviders(<Dashboard />, { store: errorStore });
    
    expect(screen.getByTestId('error-message')).toHaveTextContent(/API Error/i);
  });

  test('displays weather data when available', () => {
    const weatherData = {
      city: { name: 'Test City' },
      list: [
        {
          dt: 1625097600,
          main: { temp: 25, humidity: 60 },
          wind: { speed: 5 },
          weather: [{ description: 'clear sky' }],
        },
      ],
    };

    const dataState = {
      ...initialState,
      weather: { ...initialState.weather, data: weatherData },
    };
    const dataStore = mockStore(dataState);
    renderWithProviders(<Dashboard />, { store: dataStore });

    expect(screen.getByTestId('city-name')).toHaveTextContent('Test City');
    expect(screen.getByTestId('current-temperature')).toHaveTextContent('25.0°C');
    expect(screen.getByTestId('current-humidity')).toHaveTextContent('Humidity: 60%');
    expect(screen.getByTestId('current-wind-speed')).toHaveTextContent('Wind: 5 m/s');
    expect(screen.getByTestId('weather-description')).toHaveTextContent('clear sky');
  });

  test('handles get current location button click', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success) => 
        success({ coords: { latitude: 51.5074, longitude: -0.1278 } })
      ),
    };
    global.navigator.geolocation = mockGeolocation;

    renderWithProviders(<Dashboard />, { store });
    const locationButton = screen.getByRole('button', { name: /current location/i });

    fireEvent.click(locationButton);

    await waitFor(() => {
      expect(fetchWeatherData).toHaveBeenCalledWith({ latitude: 51.5074, longitude: -0.1278 });
    });
  });

  test('handles geolocation error', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success, error) => 
        error({ message: 'Geolocation error' })
      ),
    };
    global.navigator.geolocation = mockGeolocation;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<Dashboard />, { store });
    const locationButton = screen.getByRole('button', { name: /current location/i });

    fireEvent.click(locationButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error getting location: ', { message: 'Geolocation error' });
    });

    consoleSpy.mockRestore();
  });
});