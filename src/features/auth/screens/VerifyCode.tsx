import { useState } from 'react'
import { StyleSheet, TextInput, Pressable, Text } from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { AuthBackground } from '@/src/features/auth/components/AuthBackground'
import { AuthCard } from '@/src/features/auth/components/AuthCard'
import { Colors } from '@/src/core/theme'
import { useToastStore } from '@/src/core/store/toast.store'

export default function VerifyCodeView() {
    const { email } = useLocalSearchParams<{ email: string }>()
    const [code, setCode] = useState('')
    const showToast = useToastStore((s) => s.showToast)

    const isFormValid = code.trim().length === 6

    const handleVerify = () => {
        if (!isFormValid) {
            return showToast('Código inválido', 'error')
        }
        router.push({
            pathname: '/recovery',
            params: { email, code }
        })
    }

    return (
        <AuthBackground>
            <AuthCard>
                <Text style={styles.titleTxt}>Ingresa el código</Text>

                <TextInput
                    placeholder="Código de Verificación"
                    placeholderTextColor="gray"
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={setCode}
                    value={code}
                    style={styles.input}
                />

                <Pressable
                    style={[styles.btn, !isFormValid && styles.btnDisabled]}
                    disabled={!isFormValid}
                    onPress={handleVerify}
                >
                    <Text style={styles.btnText}>Verificar código</Text>
                </Pressable>

                <Link href="/forgot" style={styles.link}>
                    <Text style={styles.linkText}>¿No recibiste el código? Reenviar</Text>
                </Link>

                <Link href="/login" style={styles.link}>
                    <Text style={styles.linkText}>Cancelar</Text>
                </Link>
            </AuthCard>
        </AuthBackground>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        letterSpacing: 4,
    },
    btn: {
        backgroundColor: Colors.accent,
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    btnDisabled: {
        opacity: 0.5,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    link: {
        marginTop: 20,
        alignSelf: 'center',
    },
    linkText: {
        color: '#555',
        fontSize: 13,
    },
    titleTxt: {
        color: '#000',
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'semibold',
        textAlign: 'center',
    },
})
