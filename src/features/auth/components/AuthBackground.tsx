/** Full-screen background image wrapper for auth screens (login, signup, etc.). */
import { ImageBackground, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface AuthBackgroundProps {
  children: ReactNode;
}

export function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <ImageBackground 
      source={require("@/assets/images/background.png")} 
      style={styles.container} 
      resizeMode="cover"
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={20}
      >
        {children}
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
});

