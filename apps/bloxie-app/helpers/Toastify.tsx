import { Dimensions, Text, View } from "react-native";
import { ToastShowParams } from "toastify-react-native/utils/interfaces";

const DIM = Dimensions.get("window");

export const config = {
  success: (props: ToastShowParams) => (
    <View style={{ backgroundColor: '#303030', padding: 16, borderRadius: 8, width: DIM.width - 28 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
}