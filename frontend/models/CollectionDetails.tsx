//CollectionDetail.ts

export interface CollectionDetail {
  id: string;
  title: string;
  avatarUrl: string;
  username: string;
  description?: string;
  artworks: {
    id: string;
    imageUrl: string;
  }[];
  isPrivate: boolean;
}
