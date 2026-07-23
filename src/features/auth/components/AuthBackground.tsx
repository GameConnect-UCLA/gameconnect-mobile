/** Full-screen background image wrapper for auth screens (login, signup, etc.). */
import { ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

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
      <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardStickyView>
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

