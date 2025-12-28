import { WorkflowCanvas } from '@/components/container/WorkflowCanvas';
import { faBrightnessLow, faCodeCommit } from '@fortawesome/duotone-thin-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';

export default function WorkflowProcessScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();

  console.log("[key]", key);

  return (
<WorkflowCanvas
  nodes={[
    { id: 'start', type: 'start', icon: faBrightnessLow as IconProp },
    { id: 'action1', type: 'action', title: 'HTTP API-Aktion', icon: faCodeCommit as IconProp },
  ]}
  onNodePress={(node) => {}}
  onAddNode={(afterId) => console.log('Add after', afterId)}
/>
  );
}