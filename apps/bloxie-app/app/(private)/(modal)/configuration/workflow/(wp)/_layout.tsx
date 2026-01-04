import { Stack } from 'expo-router';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.30
 * @version 0.0.2
 * @component */
const WorkflowIndexLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default WorkflowIndexLayout;