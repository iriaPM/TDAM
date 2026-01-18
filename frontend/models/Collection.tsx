//collection model

export interface Collection {
    objectID: string;           
    title: string;
    username: string;
    time?: string;
    description?: string;
    location?: string;
    imageUrl: string;  
    isSaved: boolean;
    avatarUrl?: string;
}
