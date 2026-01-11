import { useUserContextStore } from "@/context/UserContext";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.45
 * @version 0.0.1
 * @type */
export type UseLinkedMailAccountProps = {
  defaultMailAccount?: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.3
 * @description Hook to use the linked mail account for the currently signed in user */
export function useLinkedMailAccount({
  defaultMailAccount,
}: UseLinkedMailAccountProps) {
  /** 
   * @description Reads all the linked mail accounts for the currently signed in user
   * -> The linked mail accounts are loaded during the initial app load
   * @see {@link context/UserContext} */
  const linkedMailAccounts = useUserContextStore((state) => state.linkedMailAccounts);

  /** 
   * @description Reads the settings for the currently signed in user
   * -> The settings are loaded during the initial app load
   * @see {@link context/UserContext} */
  const settings = useUserContextStore((state) => state.settings);

  /** @description The preferred mail account to use for sending workflow emails */
  const preferredMailAccount = defaultMailAccount ?? settings?.defaultMailAccount;

  /**
   * @description Returns the linked mail account for the currently signed in user or undefined if no linked mail account is found
   * -> Default mail account "no-reply@bloxie.ch" will be used if no default mail account is set
   * @function */
  const linkedMailAccount =() => {
    if (linkedMailAccounts.length === 0) return undefined;
    if (preferredMailAccount) {
      const preferred = linkedMailAccounts.find((account) => account.email === preferredMailAccount);
      if (preferred) return preferred;
    } else return linkedMailAccounts[0];
  };

  return { linkedMailAccount };
}