//artwork model

export interface Artwork {
    id: string;           
    title: string;
    artist: string;
    year: string;
    medium: string;
    dimensions: string;
    location: string;
    imageUrl: string;
    movement?: string;     
    isSaved: boolean;
}
