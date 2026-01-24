//UserProfile.tsx
//This is the logged user profile and other users profile view 

import { useEffect, useRef, useState } from "react";
import { Href, router, useLocalSearchParams } from "expo-router";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "@/components/imageViewer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Pressable,
    Dimensions,
} from "react-native";
import { useUserProfileViewModel } from "@/viewmodel/UserProfileViewModel";
import CreateCollectionBottomsheet from "@/components/CreateCollectionBottomsheet";
import { logout } from "../../utils/logout";

const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function UserProfile() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const {
        user,
        collections,
        isMe,
        loading,
        updateProfile,
    } = useUserProfileViewModel(id);

    const editSheetRef = useRef<any>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        if (user) {
            setEditName(user.userName);
            setEditDescription(user.description ?? "");
        }
    }, [user]);

    if (loading || !user) {
        return <LoadingSpinner visible />;
    }

    const openEditSheet = () => {
        setEditName(user.userName);
        setEditDescription(user.description ?? "");
        editSheetRef.current?.open();
    };

    const handleUpdateProfile = async () => {
        try {
            await updateProfile(editName, editDescription);
            editSheetRef.current?.close();
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const renderCollection = ({ item }: any) => (
        <View style={styles.card}>
            <Pressable
                onPress={() => {
                    router.push(`/(tabs)/collections/${item.id}` as Href);
                }}
            >
                <ImageViewer
                    imgSource={item.imageUrl
                        ? { uri: item.imageUrl }
                        : require("@/assets/images/placeholderArt.png")}
                    style={styles.cardImage}
                />
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                </Text>
            </Pressable>
        </View >
    );

    return (
        <SafeAreaView style={styles.container}>

            {/* -------- Header -------- */}
            <View style={styles.header}>
                <View style={styles.avatarRow}>
                    <ImageViewer
                        imgSource={user.avatarUrl ? { uri: user.avatarUrl } : require("@/assets/images/userPlaceholder.png")}
                        style={styles.avatar}
                    />

                    <View style={styles.headerTextAndActions}>
                        <View style={styles.usernameRow}>
                            <Text style={styles.username}>{user.userName}</Text>

                            {isMe && (
                                <View style={styles.headerActions}>
                                    <Pressable
                                        style={styles.iconButton}
                                        onPress={openEditSheet}>
                                        <Ionicons
                                            name="pencil"
                                            size={18}
                                            color="#111"
                                        />
                                    </Pressable>

                                    <Pressable
                                        style={styles.iconButton}
                                        onPress={logout}>
                                        <Ionicons
                                            name="log-out-outline"
                                            size={20}
                                            color="#111"
                                        />
                                    </Pressable>
                                </View>
                            )}
                        </View>

                        <Text style={styles.description}>
                            {user.description}
                        </Text>
                    </View>
                </View>
            </View>

            {/* -------- Collections Grid -------- */}
            <FlatList
                data={collections}
                keyExtractor={(item) => item.id}
                renderItem={renderCollection}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            />
            <RBSheet
                ref={editSheetRef}
                height={700}
                draggable={true}
                dragOnContent={true}
                customStyles={{
                    wrapper: styles.BSwrapper,
                    container: styles.BScontainerEdit,
                    draggableIcon: styles.BSdraggableIcon
                }}
            >
                <CreateCollectionBottomsheet
                    title="Edit profile"
                    submitLabel="Save"
                    name={editName}
                    description={editDescription}
                    onChangeName={setEditName}
                    onChangeDescription={setEditDescription}
                    onSubmit={async () => {
                        handleUpdateProfile();
                    }}
                />
            </RBSheet>

        </SafeAreaView>
    );
}

//-- styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    /* ---------- Header ---------- */
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 25,
    },

    avatarRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },

    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "#eee",
    },

    headerTextAndActions: {
        flex: 1,
    },

    usernameRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerActions: {
        flexDirection: "row",
        gap: 12,
    },

    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#f2f2f2",
    },

    username: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
    },

    description: {
        marginTop: 6,
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },

    /* ---------- Grid ---------- */
    grid: {
        paddingHorizontal: CARD_GAP,
        paddingBottom: 24,
    },

    row: {
        gap: CARD_GAP,
        marginBottom: CARD_GAP,
    },

    card: {
        width: CARD_WIDTH,
    },

    cardImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: "#eee",
    },

    cardTitle: {
        marginTop: 6,
        fontSize: 13,
        color: "#222",
    },

    BSwrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    BScontainerEdit: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#C2E2FA',
    },
    BSdraggableIcon: {
        backgroundColor: '#999',
    },
});
