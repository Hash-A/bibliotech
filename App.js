import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { BooksProvider } from './src/context/BooksContext';

export default function App() {
  return (
    <BooksProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </BooksProvider>
  );
}
