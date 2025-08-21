import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthProvider } from '@/contexts/AuthContext';

function TestRoot() {
  return (
    <AuthProvider>
      <></>
    </AuthProvider>
  );
}

test('AuthProvider se monte sans erreur', () => {
  render(<TestRoot />);
});

test('composants de base importables', () => {
  // Test que les imports principaux fonctionnent
  expect(() => {
    require('@/components/AGPLogo');
    require('@/constants/Colors');
    require('@/contexts/AuthContext');
  }).not.toThrow();
});