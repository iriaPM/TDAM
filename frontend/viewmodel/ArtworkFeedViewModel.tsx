//Artwork feed  view model
//retrieve and manage artworks data for the feed

import { useState } from "react";


export function ArtworksViewModel() {
    const [title] = useState('');
    const [artist] = useState('');
    const [imageUrl] = useState<string | null>(null);
    const [year] = useState('');
    const [movement] = useState('');

    const Artworks = async () => {
        
    }
    return { title, artist, imageUrl, year, movement };
}