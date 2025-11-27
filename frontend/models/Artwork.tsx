//artwork model

export interface Artwork {
    objectID: string;           
    title: string;
    artist: string;
    objectDate?: string;
    medium?: string;
    dimensions?: string;
    location?: string;
    imageUrl: string;
    movement?: string;     
    isSaved: boolean;
}
