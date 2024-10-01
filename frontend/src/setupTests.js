// src/setupTests.js

import '@testing-library/jest-dom/extend-expect';

// Mock localStorage
const localStorageMock = (() => {
   let store = {};
   return {
     getItem: (key) => store[key] || null,
     setItem: (key, value) => {
       store[key] = value.toString();
     },
     removeItem: (key) => {
       delete store[key];
     },
     clear: () => {
       store = {};
     },
   };
 })();
 
 Object.defineProperty(window, 'localStorage', {
   value: localStorageMock,
 });
 