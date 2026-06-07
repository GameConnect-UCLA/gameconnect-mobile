/** App header with logo, search, and chat buttons. */

import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Colors } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'

type Props = {
  onSearchPress?: () => void
  onChatPress?: () => void
}

/** Renders GameConnect header with logo, search icon, and chat icon. @param onSearchPress Callback when search is tapped @param onChatPress Callback when chat is tapped */
export default function FeedHeader({ onSearchPress, onChatPress }: Props) {
  const { push } = useNavigation()
  const handleSearchPress = onSearchPress ?? (() => push('/explore'))

  return (
    <ImageBackground
      source={require('@/assets/images/bgheader.png')}
      style={styles.headerBackground}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.safeArea}>
        <View style={styles.containerHeader}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/headerlogo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>GameConnect</Text>
          </View>

          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleSearchPress}>
              <Ionicons name="search" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onChatPress} style={styles.chatButton}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  headerBackground: {
    width: '100%',
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 17, 17, 0.18)',
  },
  backgroundImage: { resizeMode: 'cover' },
  safeArea: { backgroundColor: 'transparent' },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 70,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, borderRadius: 10, marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700', textAlignVertical: 'center', color: '#000000' },
  iconsContainer: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  chatButton: { marginLeft: 15 },
})
