//UserProfile.tsx
//This is the logged user profile and other users profile view 

import { useCollectionsViewModel } from "@/viewmodel/CollectionsViewModel";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
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

const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;


const MOCK_COLLECTIONS = [
    { id: "1", title: "Collection44", imageUrl: "" },
    { id: "2", title: "Collection name", imageUrl: "" },
    { id: "3", title: "Collection44", imageUrl: "" },
    { id: "4", title: "Collection name", imageUrl: "" },
    { id: "4", title: "Collection name", imageUrl: "" },
    { id: "5", title: "Collection name", imageUrl: "" },
    { id: "6", title: "Collection name", imageUrl: "" },
    { id: "7", title: "Collection name", imageUrl: "" },

];

export default function UserProfile() {

    const isMe = true;

    const editSheetRef = useRef<any>(null);
    const { id } = useLocalSearchParams<{ id: string }>();
    const { collection, loadCollections, toggleSave } = useCollectionsViewModel(id);

    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editAvatar, setEditAvatar] = useState("");
    //maybe later on edit password 

    const openEditSheet = () => {
        //if (isloading) return;

        // setEditName(user.name);
        // setEditDescription();
        // editSheetRef.current?.open();
    };
    // useEffect(() => {
    //     if (user) {
    //         setEditName(user.name);
    //         setEditDescription(user.description ?? "");
    //     }
    // }, [user]);

    // if (loading || !user) {
    //         return <LoadingSpinner visible />;
    //     }

    // const handleUpdateUser = async () => {
    //     await updateDetails(editName, editDescription);
    //     editSheetRef.current?.close();
    // };

    const renderCollection = ({ item }: any) => (
        <View style={styles.card}>
            <ImageViewer
                imgSource={item.imageUrl
                    ? { uri: item.imageUrl }
                    : require("@/assets/images/placeholderArt.png")}
                style={styles.cardImage}
            />
            <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>

            {/* -------- Header -------- */}
            <View style={styles.header}>
                <View style={styles.avatarRow}>
                    <ImageViewer
                        imgSource={require("@/assets/images/userPlaceholder.png")}
                        style={styles.avatar}
                    />

                    <View style={styles.headerTextAndActions}>
                        <View style={styles.usernameRow}>
                            <Text style={styles.username}>Username</Text>

                            {isMe && (
                                <View style={styles.headerActions}>
                                    <Pressable style={styles.iconButton}>
                                        <Ionicons
                                            name="pencil"
                                            size={18}
                                            color="#111"
                                        />
                                    </Pressable>

                                    <Pressable style={styles.iconButton}>
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
                            descriptiondescriptiondescription
                            descriptiondescriptiondescription
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* -------- Collections Grid -------- */}
            <FlatList
                data={MOCK_COLLECTIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderCollection}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            />
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
});
