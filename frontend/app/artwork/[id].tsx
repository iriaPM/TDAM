// [id].tsx 
// displays fields that are actually returned by the APIs

import { useLocalSearchParams, router, Href } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
} from "react-native";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getArtworkDetail, markArtworkViewed, toggleSaveArtwork, getMyCollections, toggleArtworkInCollection, createCollection } from "@/services/api";
import { Ionicons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import SaveArtworkBottomsheet from "@/components/SaveArtworkBottomsheet";
import CreateCollectionBottomsheet from "@/components/CreateCollectionBottomsheet";
import { Collection } from "@/models/Collection";

export default function ArtworkDetailView() {
    const { id } = useLocalSearchParams();
    const [artwork, setArtwork] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDescription, setNewCollectionDescription] = useState("");
    const saveSheetRef = useRef<any>(null);
    const createSheetRef = useRef<any>(null);

    useEffect(() => {
        if (!id) return;

        const loadArtwork = async () => {
            try {
                const data = await getArtworkDetail(id as string);
                setArtwork(data);
                setIsSaved(data.isSaved ?? false);
                await markArtworkViewed(id as string);
            } catch (e) {
                console.error("Failed to load artwork detail", e);
            } finally {
                setLoading(false);
            }
        };

        loadArtwork();
    }, [id]);

    if (!artwork && !loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Artwork not found</Text>
            </View>
        );
    }

    return (
        <>
            <LoadingSpinner visible={loading} />

            {!loading && artwork && (
                <ScrollView style={styles.container}>
                    {/* Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: artwork.imageUrl }}
                            style={styles.image}
                        />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>

                        {/* Title and Artist */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>{artwork.title}</Text>

                            {artwork.artist && (
                                <View style={styles.artistInfo}>
                                    <Pressable onPress={() => {
                                        if (!artwork.artist) return;
                                        router.push(`/artist/${encodeURIComponent(artwork.artist)}` as Href);
                                    }}>
                                        <Text style={styles.artistName}>{artwork.artist}</Text>
                                    </Pressable>
                                    {artwork.artistNationality && (
                                        <Text style={styles.artistNationality}>{artwork.artistNationality}</Text>
                                    )}
                                    {artwork.artistBio && (
                                        <Text style={styles.artistBio}>{artwork.artistBio}</Text>
                                    )}
                                </View>
                            )}
                        </View>
                        {/* Save / Add to Collection Buttons */}
                        <View style={styles.actionRow}>
                            <Pressable
                                style={styles.actionButton}
                                onPress={async () => {
                                    if (!artwork) return;
                                    try {
                                        const result = await toggleSaveArtwork(artwork.objectID, artwork.imageUrl);
                                        setIsSaved(result.isSaved);
                                    } catch (e) {
                                        console.error("Failed to save artwork", e);
                                    }
                                }}
                            >
                                <Ionicons
                                    name={isSaved ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isSaved ? "#EF4444" : "#475569"}
                                />
                                <Text style={[styles.actionLabel, isSaved && styles.actionLabelSaved]}>
                                    {isSaved ? "Saved" : "Save"}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.actionButton}
                                onPress={async () => {
                                    if (!artwork) return;
                                    try {
                                        const data = await getMyCollections();
                                        setCollections(
                                            data.map((c: any) => ({
                                                id: c.id,
                                                title: c.title,
                                                imageUrl: c.coverImageUrl ?? "",
                                                isSaved: Array.isArray(c.artworkIds)
                                                    ? c.artworkIds.includes(artwork.objectID)
                                                    : false,
                                            }))
                                        );
                                    } catch (e) {
                                        console.error("Failed to load collections", e);
                                    }
                                    saveSheetRef.current?.open();
                                }}
                            >
                                <Ionicons name="add-circle-outline" size={24} color="#475569" />
                                <Text style={styles.actionLabel}>Add to collection</Text>
                            </Pressable>
                        </View>

                        {/* Primary Info Grid */}
                        {(artwork.period || artwork.century) && (
                            <View style={styles.gridContainer}>
                                {artwork.period && (
                                    <View style={styles.gridItem}>
                                        <Text style={styles.gridLabel}>Period</Text>
                                        <Text style={styles.gridValue}>{artwork.period}</Text>
                                    </View>
                                )}
                                {artwork.century && (
                                    <View style={styles.gridItem}>
                                        <Text style={styles.gridLabel}>Century</Text>
                                        <Text style={styles.gridValue}>{artwork.century}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Date */}
                        {artwork.objectDate && (
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <Ionicons name="calendar-outline" size={20} color="#475569" />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Date</Text>
                                        <Text style={styles.infoValue}>{artwork.objectDate}</Text>
                                        {(artwork.objectBeginDate && artwork.objectEndDate) && (
                                            <Text style={styles.infoSubtext}>
                                                {artwork.objectBeginDate}–{artwork.objectEndDate}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Materials & Technique */}
                        <View style={styles.detailsSection}>
                            {artwork.medium && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="color-palette-outline" size={20} color="#475569" />
                                    <View style={styles.detailContent}>
                                        <Text style={styles.detailLabel}>Medium</Text>
                                        <Text style={styles.detailValue}>{artwork.medium}</Text>
                                    </View>
                                </View>
                            )}

                            {artwork.technique && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="brush-outline" size={20} color="#475569" />
                                    <View style={styles.detailContent}>
                                        <Text style={styles.detailLabel}>Technique</Text>
                                        <Text style={styles.detailValue}>{artwork.technique}</Text>
                                    </View>
                                </View>
                            )}

                            {artwork.dimensions && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="resize-outline" size={20} color="#475569" />
                                    <View style={styles.detailContent}>
                                        <Text style={styles.detailLabel}>Dimensions</Text>
                                        <Text style={styles.detailValue}>{artwork.dimensions}</Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Classification */}
                        {(artwork.classification || artwork.department || artwork.culture) && (
                            <View style={styles.classificationSection}>
                                {artwork.classification && (
                                    <View style={styles.classificationItem}>
                                        <Text style={styles.detailLabel}>Classification</Text>
                                        <Text style={styles.classificationValue}>{artwork.classification}</Text>
                                    </View>
                                )}
                                {artwork.department && (
                                    <View style={styles.classificationItem}>
                                        <Text style={styles.detailLabel}>Department</Text>
                                        <Text style={styles.classificationValue}>{artwork.department}</Text>
                                    </View>
                                )}
                                {artwork.culture && (
                                    <View style={styles.classificationItem}>
                                        <Text style={styles.detailLabel}>Culture</Text>
                                        <Text style={styles.classificationValue}>{artwork.culture}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Geography */}
                        {(artwork.city || artwork.country || artwork.region) && (
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <Ionicons name="location-outline" size={20} color="#475569" />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Geography</Text>
                                        <Text style={styles.infoValue}>
                                            {[artwork.city, artwork.country].filter(Boolean).join(', ')}
                                        </Text>
                                        {artwork.region && (
                                            <Text style={styles.infoSubtext}>{artwork.region}</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Description */}
                        {artwork.description && (
                            <View style={styles.textSection}>
                                <Text style={styles.sectionLabel}>Description</Text>
                                <Text style={styles.sectionText}>{artwork.description}</Text>
                            </View>
                        )}

                        {/* Commentary */}
                        {artwork.commentary && (
                            <View style={styles.textSection}>
                                <Text style={styles.sectionLabel}>Commentary</Text>
                                <Text style={styles.sectionText}>{artwork.commentary}</Text>
                            </View>
                        )}

                        {/* Provenance */}
                        {artwork.provenance && (
                            <View style={styles.provenanceCard}>
                                <Text style={styles.sectionLabel}>Provenance</Text>
                                <Text style={styles.sectionText}>{artwork.provenance}</Text>
                            </View>
                        )}

                        {/* Repository & Credit */}
                        <View style={styles.repositorySection}>
                            {artwork.repository && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="business-outline" size={20} color="#475569" />
                                    <View style={styles.detailContent}>
                                        <Text style={styles.detailLabel}>Repository</Text>
                                        <Text style={styles.repositoryValue}>{artwork.repository}</Text>
                                    </View>
                                </View>
                            )}

                            {artwork.creditLine && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="ribbon-outline" size={20} color="#475569" />
                                    <View style={styles.detailContent}>
                                        <Text style={styles.detailLabel}>Credit Line</Text>
                                        <Text style={styles.detailValue}>{artwork.creditLine}</Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        <View style={styles.spacer} />
                    </View>
                </ScrollView>
            )}
            <RBSheet
                ref={saveSheetRef}
                height={700}
                draggable={true}
                dragOnContent={true}
                customStyles={{
                    wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
                    container: { borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#FF8F8F' },
                    draggableIcon: { backgroundColor: '#999' },
                }}
            >
                {artwork && (
                    <SaveArtworkBottomsheet
                        artworkTitle={artwork.title}
                        artworkArtist={artwork.artist}
                        artworkImageUrl={artwork.imageUrl}
                        collections={collections}
                        onCreateNew={() => {
                            saveSheetRef.current?.close();
                            createSheetRef.current?.open();
                        }}
                        onToggleCollection={async (collectionId) => {
                            try {
                                await toggleArtworkInCollection(collectionId, artwork.objectID, artwork.imageUrl);
                                setCollections(prev =>
                                    prev.map(c => c.id === collectionId ? { ...c, isSaved: !c.isSaved } : c)
                                );
                            } catch (e) {
                                console.error("Failed to toggle artwork in collection", e);
                            }
                        }}
                    />
                )}
            </RBSheet>

            <RBSheet
                ref={createSheetRef}
                height={700}
                draggable={true}
                dragOnContent={true}
                customStyles={{
                    wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
                    container: { borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#C2E2FA' },
                    draggableIcon: { backgroundColor: '#999' },
                }}
            >
                <CreateCollectionBottomsheet
                    name={newCollectionName}
                    description={newCollectionDescription}
                    onChangeName={setNewCollectionName}
                    onChangeDescription={setNewCollectionDescription}
                    onSubmit={async () => {
                        if (!newCollectionName.trim() || !artwork) return;
                        try {
                            const created = await createCollection(newCollectionName, newCollectionDescription, false);
                            await toggleArtworkInCollection(created.id, artwork.objectID, artwork.imageUrl);
                            createSheetRef.current?.close();
                            setNewCollectionName("");
                            setNewCollectionDescription("");
                        } catch (e) {
                            console.error("Failed to create collection", e);
                        }
                    }}
                    submitLabel="Create"
                    title="Create a new collection!"
                />
            </RBSheet>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    errorText: {
        fontSize: 16,
        color: "#EF4444",
    },
    imageContainer: {
        marginTop: 30,
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#FFFFFF",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    content: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    titleSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#0F172A",
        marginBottom: 12,
        lineHeight: 32,
    },
    artistInfo: {
        gap: 8,
    },
    artistName: {
        fontSize: 18,
        color: "#0F172A",
        fontWeight: "500",
    },
    artistNationality: {
        fontSize: 14,
        color: "#64748B",
    },
    artistBio: {
        fontSize: 14,
        color: "#475569",
        lineHeight: 20,
    },
    gridContainer: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 24,
    },
    gridItem: {
        flex: 1,
    },
    gridLabel: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 4,
    },
    gridValue: {
        fontSize: 14,
        color: "#0F172A",
        fontWeight: "500",
    },
    infoCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
    },
    infoContent: {
        flex: 1,
        gap: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: "#64748B",
    },
    infoValue: {
        fontSize: 14,
        color: "#0F172A",
        fontWeight: "500",
    },
    infoSubtext: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 2,
    },
    detailsSection: {
        gap: 12,
        marginBottom: 24,
    },
    detailRow: {
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: "#0F172A",
    },
    classificationSection: {
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 24,
        marginBottom: 24,
        gap: 12,
    },
    classificationItem: {
        marginBottom: 12,
    },
    classificationValue: {
        fontSize: 14,
        color: "#0F172A",
        fontWeight: "500",
        marginTop: 2,
    },
    textSection: {
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 24,
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 14,
        color: "#475569",
        lineHeight: 22,
    },
    provenanceCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    repositorySection: {
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 24,
        marginBottom: 16,
        gap: 16,
    },
    repositoryValue: {
        fontSize: 14,
        color: "#0F172A",
        fontWeight: "500",
        marginTop: 2,
    },
    spacer: {
        height: 24,
    },
    actionRow: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    actionLabel: {
        fontSize: 14,
        color: "#475569",
    },
    actionLabelSaved: {
        color: "#EF4444",
    },
});