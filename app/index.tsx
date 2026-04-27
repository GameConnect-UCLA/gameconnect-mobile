import { Text,View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  // // In a real app, logic here would check if user is authenticated
  // // and redirect to (tabs) or (auth) accordingly.
  // return <Redirect href="/login" />;
  return (<>
  <SafeAreaView>
    <Text>Splash Screen</Text>
  </SafeAreaView>
  </>)
}
