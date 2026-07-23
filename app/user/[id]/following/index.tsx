import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserFollowing } from '@/src/features/profile/hooks/useUserFollowing';
import { FlatList, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FollowingScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data = [], isLoading } = useUserFollowing(id);

    if (!id) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>ID de usuario no válido</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#033563" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                    <Ionicons name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Siguiendo</Text>
                {data.length === 0 ? (
                    <Text style={{ color: '#666', fontSize: 16 }}>Aún no sigue a nadie.</Text>
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
                                onPress={() => router.push(`/user/${item.id}`)}
                            >
                                <Image
                                    source={{ uri: item.profilePic || 'https://via.placeholder.com/50' }}
                                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
                                />
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                        {item.displayName || item.username}
                                    </Text>
                                    <Text style={{ color: '#666' }}>@{item.username}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}