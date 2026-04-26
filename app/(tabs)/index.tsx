import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Header from '../../src/components/ui/feed-header';

export default function FeedScreen() {
  return (
    <ImageBackground
      source={require('../../assets/images/bgbody.png')}
      style={styles.container}
    >
      <Header />
      <View style={styles.container}>
        <Text style={styles.text}>Feed / Inicio</Text>
      </View>
    </ImageBackground>
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
  header:{

  }
});
