import React from "react";
import { ScrollView } from "react-native"

import { STYLES } from "@codemize/constants/Styles"

import { KEYS } from "@/constants/Keys";
import { WORKFLOW_ITEMS_EMAIL_OR_SMS, WorkflowItemProps } from "@/constants/Workflow";

import ListItemGroup from "@/components/container/ListItemGroup";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";

import ProviderStyle from "@/styles/screens/private/modal/configuration/integration/Provider";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { router } from "expo-router";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.31
 * @version 0.0.1
 * @type */
type WorkflowGroupItemsProps = {
  title: string;
  items: WorkflowItemProps[];
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.31
 * @version 0.0.1
 * @component */
const ScreenConfigurationWorkflowProvider = () => {
  /** @description Handles the display of the individual provider groups with the corresponding integration items*/
  const workflowItems: WorkflowGroupItemsProps[] = React.useMemo(() => [{
    title: "i18n.screens.workflow.workProcess.emailOrSms.title",
    items: WORKFLOW_ITEMS_EMAIL_OR_SMS,
  }], []);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={ProviderStyle.view}>
        {workflowItems.map((group) => ( 
          <ListItemGroup 
            key={`${KEYS.workflowGroup}-${group.title}`}
            title={group.title}
            gap={STYLES.sizeGap + 4}>
            {group.items.map((item) => (
              <TouchableHaptic
                key={`${KEYS.workflowGroupItem}-${item.workflowKey}`}
                onPress={() => {
                  console.log("press", item.workflowKey);
                  router.push({
                    pathname: '/configuration/workflow/(wp)/[workflowKey]',
                    params: { workflowKey: item.workflowKey },
                  });
                }}>
                  <ListItemWithChildren
                    icon={item.icon}
                    iconSize={24}
                    title={item.title}
                    description={item.description}
                    type={ListItemWithChildrenTypeEnum.navigation} />
              </TouchableHaptic>
            ))}
          </ListItemGroup>
        ))}
    </ScrollView>
  );
};

export default ScreenConfigurationWorkflowProvider;