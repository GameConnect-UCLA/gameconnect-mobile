import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'

const BG = require("@/assets/images/bgbody.png");

const newgroup = () => {
    return (
        <ImageBackground style={styles.safe} source={BG}>
            <SafeAreaView>
                <Text>Create new Group</Text>
            </SafeAreaView>
        </ImageBackground>
    )
}
export default newgroup

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    }
})