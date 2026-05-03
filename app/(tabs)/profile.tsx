import { StyleSheet, View } from 'react-native';
import UserProfileScreen from '../../src/components/user/user-profile';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <UserProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
