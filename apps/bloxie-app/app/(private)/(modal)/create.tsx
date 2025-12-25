import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import StackModalHeader from "@/components/container/StackModalHeader";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @component */
const ModalCreate = () => {
  return (
    <SafeAreaContextViewBase>
      <StackModalHeader title={"anlegen"} />
    </SafeAreaContextViewBase>
  )
}

export default ModalCreate;