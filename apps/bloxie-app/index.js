import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

/**
 * @public
 * @description Must be exported or Fast Refresh won't update the context
 * @function */
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
