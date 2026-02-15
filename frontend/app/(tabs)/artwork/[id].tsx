// [id].tsx 
// displays fields that are actually returned by the APIs

import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";
import { getArtworkDetail, markArtworkViewed } from "@/services/api";
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ArtworkDetailView() {
    const { id } = useLocalSearchParams();
    const [artwork, setArtwork] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadArtwork = async () => {
            try {
                const data = await getArtworkDetail(id as string);
                setArtwork(data);
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
                                    <Text style={styles.artistName}>{artwork.artist}</Text>
                                    {artwork.artistNationality && (
                                        <Text style={styles.artistNationality}>{artwork.artistNationality}</Text>
                                    )}
                                    {artwork.artistBio && (
                                        <Text style={styles.artistBio}>{artwork.artistBio}</Text>
                                    )}
                                </View>
                            )}
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
});