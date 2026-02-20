import requests
import pandas as pd

response = requests.get("http://localhost:8080/api/ml/dataset")
data = response.json()

df = pd.DataFrame(data)

print(df.head())