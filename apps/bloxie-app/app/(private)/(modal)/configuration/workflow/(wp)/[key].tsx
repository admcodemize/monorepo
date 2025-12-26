import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function WorkflowProcessScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();

  console.log("[key]", key);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Workflow: {key}</Text>
      {/* Detail-UI hier */}
    </View>
  );
}