from fastapi import FastAPI, HTTPException
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

# ✅ Load trained model & scaler
model = joblib.load("model/fraud_detection_model.pkl")
scaler = joblib.load("model/scaler.pkl")

# ✅ Home Route
@app.get("/")
def home():
    return {"message": "✅ Fraud Detection API is Running!"}

# ✅ Fraud Detection Route (POST)
@app.post("/predict")
def predict(data: dict):
    try:
        # ✅ Convert input data into a DataFrame
        input_data = pd.DataFrame([data])

        # ✅ Feature Engineering
        input_data["Transaction Amount Log"] = np.log1p(input_data["Amount_INR"])
        input_data["Is High Amount"] = (input_data["Amount_INR"] > 50000).astype(int)
        input_data = input_data.drop(columns=["Amount_INR"])  # Drop original amount column

        # ✅ Apply scaling
        input_scaled = scaler.transform(input_data)

        # ✅ Make prediction
        prediction = model.predict(input_scaled)[0]

        return {"is_fraud": bool(prediction)}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
