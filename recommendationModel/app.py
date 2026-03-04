from flask import Flask, request, jsonify
import joblib
import requests
import pandas as pd

app = Flask(__name__)

# load model and vectorizer
model = joblib.load("./model/nb_recommender.pkl")
vectorizer = joblib.load("./model/vectorizer.pkl")

SPRING_BOOT_URL = "http://localhost:8080"

# fetch full dataset and filter specific user
def get_user_data(user_id):
    dataset = requests.get(f"{SPRING_BOOT_URL}/api/ml/dataset").json()
    user_rows = [row for row in dataset if row["userId"] == user_id]
    return user_rows

# build preference text from first row (all rows have same preferences)
def build_user_prefs_text(user_rows):
    prefs = user_rows[0]
    return " ".join([
        prefs.get("preferredArtists", "") or "",
        prefs.get("preferredStyles", "") or "",
        prefs.get("preferredMediums", "") or "",
        prefs.get("preferredTimePeriods", "") or "",
        prefs.get("preferredMovements", "") or "",
    ])

# vectorize, predict and return top N
def score_and_rank(df, top_n, return_cols):
    X = vectorizer.transform(df["combined_text"])
    df["like_probability"] = model.predict_proba(X)[:, 1]
    return (
        df.sort_values("like_probability", ascending=False)
        .head(top_n)
        [return_cols]
        .reset_index(drop=True)
    )


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

# recommendation endpoint (artworks)
@app.route("/recommend/<int:user_id>", methods=["GET"])
def recommend(user_id):
    top_n = request.args.get("top_n", default=10, type=int)

    try:
        user_rows = get_user_data(user_id)
        if not user_rows:
            return jsonify({"error": f"No data found for user {user_id}"}), 404

        user_prefs_text = build_user_prefs_text(user_rows)
        seen_ids = set(row["artworkId"] for row in user_rows)

        candidates = requests.get(f"{SPRING_BOOT_URL}/api/artworks/random").json()
        unseen = [a for a in candidates if a["objectID"] not in seen_ids]

        if not unseen:
            return jsonify({"recommendations": [], "message": "No new artworks to recommend"})

        rows = []
        for artwork in unseen:
            combined = " ".join([
                artwork.get("artist", "") or "",
                artwork.get("period", "") or "",
                artwork.get("culture", "") or "",
                artwork.get("medium", "") or "",
                user_prefs_text
            ])
            rows.append({
                "objectID": artwork["objectID"],
                "title": artwork.get("title", ""),
                "artist": artwork.get("artist", ""),
                "period": artwork.get("period", ""),
                "imageUrl": artwork.get("imageUrl", ""),
                "combined_text": combined
            })

        df_candidates = pd.DataFrame(rows)
        recommendations = score_and_rank(
            df_candidates, top_n,
            ["objectID", "title", "artist", "period", "imageUrl", "like_probability"]
        )

        return jsonify({
            "userId": user_id,
            "recommendations": recommendations.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# recommendation endpoint (collections)
@app.route("/recommend/collections/<int:user_id>", methods=["GET"])
def recommend_collections(user_id):
    top_n = request.args.get("top_n", default=10, type=int)

    try:
        user_rows = get_user_data(user_id)
        if not user_rows:
            return jsonify({"error": f"No data found for user {user_id}"}), 404

        user_prefs_text = build_user_prefs_text(user_rows)

        collections = requests.get(f"{SPRING_BOOT_URL}/api/ml/collections").json()
        other_collections = [c for c in collections if c["ownerId"] != user_id]

        if not other_collections:
            return jsonify({"recommendations": [], "message": "No collections to recommend"})

        rows = []
        for collection in other_collections:
            combined = " ".join([
                collection.get("artists", "") or "",
                collection.get("periods", "") or "",
                collection.get("cultures", "") or "",
                collection.get("mediums", "") or "",
                user_prefs_text
            ])
            rows.append({
                "collectionId": str(collection["collectionId"]),
                "title": collection.get("title", ""),
                "description": collection.get("description", ""),
                "combined_text": combined
            })

        df_collections = pd.DataFrame(rows)
        recommendations = score_and_rank(
            df_collections, top_n,
            ["collectionId", "title", "description", "like_probability"]
        )

        return jsonify({
            "userId": user_id,
            "recommendations": recommendations.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)