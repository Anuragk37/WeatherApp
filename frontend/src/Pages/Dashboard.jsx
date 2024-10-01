import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeatherData } from '../features/weatherSlice';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaSearch, FaMapMarkerAlt, FaThermometerHalf, FaTint, FaWind, FaSun, FaMoon, FaCloud } from 'react-icons/fa';
import Header from '../Components/Header';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, loading, error } = useSelector((state) => state.weather);
  const [city, setCity] = useState('');

  useEffect(() => {
    dispatch(fetchWeatherData('Kerala'));
  }, [dispatch]);

  const processData = () => {
    if (!data || !data.list) return [];
    return data.list.map((item) => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      description: item.weather[0].description,
    }));
  };

  const processedData = processData();

  const getCurrentWeather = () => {
    if (!data || !data.list) return null;
    return data.list[0];
  };

  const currentWeather = getCurrentWeather();

  const getWeatherIcon = (description) => {
    if (description.includes('clear')) {
      return <FaSun className="text-yellow-400 text-5xl" />;
    } else if (description.includes('cloud')) {
      return <FaCloud className="text-gray-400 text-5xl" />;
    } else if (description.includes('rain')) {
      return <FaTint className="text-blue-400 text-5xl" />;
    } else {
      return <FaMoon className="text-indigo-400 text-5xl" />;
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      dispatch(fetchWeatherData(city));
      setCity('');
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch(fetchWeatherData({ latitude, longitude }));
      }, (error) => {
        console.error("Error getting location: ", error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
          <h1 className="text-4xl font-bold mb-4 text-indigo-800">Weather Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome back, {user}!</p>
          
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="relative w-full md:w-96 mb-4 md:mb-0 md:mr-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-indigo-300 rounded-full focus:outline-none focus:border-indigo-500"
                placeholder="Enter city name"
              />
              <FaMapMarkerAlt className="absolute left-3 top-3 text-indigo-400" />
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
            <button
              onClick={handleGetCurrentLocation}
              className="ml-4 w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300 flex items-center justify-center"
            >
              <FaMapMarkerAlt className="mr-2" />
              Current Location
            </button>
          </div>

          {loading && <div className="text-center text-indigo-600">Loading weather data...</div>}
          {error && <div data-testid="error-message" className="text-center text-red-500 bg-red-100 p-4 rounded-lg">Error: {error}</div>}

          {currentWeather && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2 flex items-center justify-center md:justify-start">
                    <FaMapMarkerAlt className="mr-2" />
                    <span data-testid="city-name">{data.city.name}</span>
                  </h2>
                  <p className="text-xl flex items-center justify-center md:justify-start">
                    {getWeatherIcon(currentWeather.weather[0].description)}
                    <span data-testid="weather-description" className="ml-2">{currentWeather.weather[0].description}</span>
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-5xl font-bold mb-2 flex items-center justify-center md:justify-end">
                    <FaThermometerHalf className="mr-2" />
                    <span data-testid="current-temperature">{currentWeather.main.temp.toFixed(1)}°C</span>
                  </p>
                  <p className="text-lg flex items-center justify-center md:justify-end">
                    <FaTint className="mr-2" />
                    <span data-testid="current-humidity">Humidity: {currentWeather.main.humidity}%</span>
                  </p>
                  <p className="text-lg flex items-center justify-center md:justify-end mt-2">
                    <FaWind className="mr-2" />
                    <span data-testid="current-wind-speed">Wind: {currentWeather.wind.speed} m/s</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-indigo-800">
                  <FaThermometerHalf className="mr-2 text-indigo-500" />
                  Temperature Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="temperature" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-indigo-800">
                  <FaTint className="mr-2 text-blue-500" />
                  Humidity and Wind Speed
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#82ca9d" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="windSpeed" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xl overflow-x-auto">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-indigo-800">
                <FaCloud className="mr-2 text-indigo-500" />
                Weather Forecast Table
              </h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature (°C)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind Speed (m/s)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.temperature.toFixed(1)}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.humidity}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.windSpeed} m/s</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;