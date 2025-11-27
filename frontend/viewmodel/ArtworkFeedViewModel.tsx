//Artwork feed  view model
//retrieve and manage artworks data for the feed

import { useState } from "react";


export function useArtworksViewModel() {
    const [artworks, setArtworks] = useState([
        {
            id: "1",
            title: "Starry Night",
            artist: "Vincent van Gogh",
            image: require("../assets/images/StarryNight.png"),
            year: "1889",
            movement: "Post-Impressionism",
            isSaved: false
        },
        {
            id: "2",
            title: "Starry Night",
            artist: "Vincent van Gogh",
            image: require("../assets/images/BertheMorisot.png"),
            year: "1889",
            movement: "Post-Impressionism",
            isSaved: false
        },
    ]);
    const toggleSave = (id: string) => {
        setArtworks(prev =>
            prev.map(artwork =>
                artwork.id === id ? { ...artwork, isSaved: !artwork.isSaved } : artwork
            )
        );
    };

    return { artworks, toggleSave };
}