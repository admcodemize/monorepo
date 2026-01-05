import React from "react";
import { DimensionValue, ScrollView } from "react-native";

import { useLinkedMailAccounts } from "@/hooks/auth/useLinkedMailAccount";
import { getImageAssetByProvider } from "@/helpers/Events";
import { ConvexLinkedAPIProps } from "@codemize/backend/Types";
import { ProviderEnum } from "@/constants/Provider";
import { STYLES } from "@codemize/constants/Styles";

import ListItemGroup from "@/components/container/ListItemGroup";
import TouchableDropdownItemBase from "@/components/button/TouchableDropdownItemBase";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @component */
export type ListProviderMailAccountsProps = {
  maxHeight?: DimensionValue;
  showListGroup?: boolean;
  onPress: (mailAccount: ConvexLinkedAPIProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.4
 * @param {ListTemplatesWorkflowDecisionProps} param0
 * @param {DimensionValue} param0.maxHeight - The maximum height of the scroll view
 * @param {(decision: ConvexRuntimeAPIWorkflowDecisionProps) => void} param0.onPress - The function to call when a decision is pressed
 * @component */
const ListProviderMailAccounts = ({
  maxHeight = "100%",
  showListGroup = true,
  onPress,
}: ListProviderMailAccountsProps) => {
  /** 
   * @description Returns the linked mail account for the currently signed in user 
   * @see {@link hooks/auth/useLinkedAccount} */
  const { linkedMailAccounts, linkedMailAccount } = useLinkedMailAccounts();

  /**
   * @description Internal function to call the onPress function
   * @param {ConvexLinkedAPIProps} linkedMailAccount - The linked mail account
   * @param {string|number} key - The external key as text of the linked mail account => stoecklim7@gmail.com
   * @function */
  const onPressInternal = React.useCallback(
    (linkedMailAccount: ConvexLinkedAPIProps) =>
    (key: string|number) => onPress(linkedMailAccount), [onPress]);
  
  return (
    <>
    {showListGroup && <ListItemGroup
      title={"i18n.lists.templatesWorkflowDecision.title"}
      gap={STYLES.sizeGap}
      style={{ paddingVertical: 10 }} />}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 4 }}
      style={{ maxHeight }}>
      {linkedMailAccounts?.map((mailAccount, index) => (
        <TouchableDropdownItemBase
          itemKey={mailAccount._id as string}
          image={getImageAssetByProvider(mailAccount.provider as ProviderEnum)}
          text={mailAccount.email}
          isSelected={linkedMailAccount()?._id === mailAccount._id}
          onPress={onPressInternal(mailAccount)} />
      ))}
    </ScrollView>
    </>
  );
};

export default ListProviderMailAccounts;