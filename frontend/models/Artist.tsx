//Artist model

export interface ArtistDetail {
    name: string;
    bio?: string;
    nationality?: string;
    birthYear?: string;
    deathYear?: string;
    wikipediaUrl?: string;
    artworks: ArtistArtwork[];
}

export interface ArtistArtwork {
    objectID: string;
    title: string;
    artist: string;
    objectDate?: string;
    imageUrl?: string;
    source: string;
}