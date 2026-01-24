//collection model

export interface Collection {
    id: string;           
    title: string;
    username: string;
    time?: string;
    description?: string;
    imageUrl: string;  
    isSaved: boolean;
    avatarUrl?: string;
    userId: string;
}
