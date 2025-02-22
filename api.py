from fastapi import FastAPI, HTTPException
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

# ✅ Load trained model & scaler
model = joblib.load("model/fraud_detection_model.pkl")
scaler = joblib.load("model/scaler.pkl")

# ✅ Home Route (GET)
@app.get("/")
def home():
    return {"message": "✅ Fraud Detection API is Running!"}

# ✅ Fraud Detection Route (POST)
@app.post("/predict")
def predict(data: dict):
    try:
        # Normalize keys: Replace underscores with spaces
        data = {key.replace("_", " "): value for key, value in data.items()}
        input_data = pd.DataFrame([data])

        # ✅ Feature Engineering
        input_data["Transaction Amount Log"] = np.log1p(input_data["Amount INR"])
        input_data["Is High Amount"] = (input_data["Amount INR"] > 50000).astype(int)
        input_data = input_data.drop(columns=["Amount INR"])  # Drop original amount column

        # ✅ Ensure all required features exist
        required_features = [
            "Transaction Amount Log", 
            "Sender Transaction Count", 
            "Receiver Transaction Count", 
            "Time Diff Between Transactions", 
            "Is High Amount", 
            "Status"
        ]
        missing_features = [f for f in required_features if f not in input_data.columns]
        if missing_features:
            raise HTTPException(status_code=400, detail=f"Missing features: {missing_features}")

        # ✅ Apply Scaling
        input_scaled = scaler.transform(input_data[required_features])

        # ✅ Make Prediction
        prediction = model.predict(input_scaled)[0]

        return {"is_fraud": bool(prediction)}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))