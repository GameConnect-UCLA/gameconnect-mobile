import { Image, StyleSheet, View } from 'react-native';

export function AuthTitle() {
  return (
    <View style={styles.container}>
      <Image 
        source={require("../../../assets/images/title.png")} 
        style={styles.title} 
        resizeMode="contain" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    width: 280, 
    height: 120,
  },
});