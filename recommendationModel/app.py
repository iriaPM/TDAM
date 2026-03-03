from flask import Flask, request, jsonify
import joblib
import requests
import pandas as pd

app = Flask(__name__)

# load model and vectorizer
model = joblib.load("./model/nb_recommender.pkl")
vectorizer = joblib.load("./model/vectorizer.pkl")

SPRING_BOOT_URL = "http://localhost:8080"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


# recommendation endpoint
@app.route("/recommend/<int:user_id>", methods=["GET"])
def recommend(user_id):
    top_n = request.args.get("top_n", default=10, type=int)

    try:
        # getting full dataset and filter to specific user
        dataset = requests.get(f"{SPRING_BOOT_URL}/api/ml/dataset").json()
        user_rows = [row for row in dataset if row["userId"] == user_id]

        if not user_rows:
            return jsonify({"error": f"No data found for user {user_id}"}), 404

        # getting user preferences from first row
        prefs = user_rows[0]
        user_prefs_text = " ".join([
            prefs.get("preferredArtists", "") or "",
            prefs.get("preferredStyles", "") or "",
            prefs.get("preferredMediums", "") or "",
            prefs.get("preferredTimePeriods", "") or "",
            prefs.get("preferredMovements", "") or "",
        ])

        # getting already seen artwork IDs
        seen_ids = set(row["artworkId"] for row in user_rows)

        # fetch candidate artworks
        candidates = requests.get(f"{SPRING_BOOT_URL}/api/artworks/random").json()

        # filter out seen artworks
        unseen = [a for a in candidates if a["objectID"] not in seen_ids]

        if not unseen:
            return jsonify({"recommendations": [], "message": "No new artworks to recommend"})

        # combined text features
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

        # vectorize and predict
        X = vectorizer.transform(df_candidates["combined_text"])
        df_candidates["like_probability"] = model.predict_proba(X)[:, 1]

        # sort and return top N
        recommendations = (
            df_candidates
            .sort_values("like_probability", ascending=False)
            .head(top_n)
            [["objectID", "title", "artist", "period", "imageUrl", "like_probability"]]
            .reset_index(drop=True)
        )

        return jsonify({
            "userId": user_id,
            "recommendations": recommendations.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)