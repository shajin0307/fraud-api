from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI()

# ✅ Load trained model & scaler
model = joblib.load("model/fraud_detection_model.pkl")
scaler = joblib.load("model/scaler.pkl")

# ✅ Define expected features
FEATURES = ["Transaction Amount Log", "Sender Transaction Count", "Receiver Transaction Count",
            "Time Diff Between Transactions", "Is High Amount", "Status"]

# ✅ Define request schema
class TransactionData(BaseModel):
    Amount_INR: float
    Sender_Transaction_Count: int
    Receiver_Transaction_Count: int
    Time_Diff_Between_Transactions: float
    Status: int

@app.get("/")
def home():
    return {"message": "✅ FastAPI Fraud Detection API is Running!"}

@app.post("/predict")
def predict(transaction: TransactionData):
    try:
        # ✅ Convert input into a DataFrame
        input_data = pd.DataFrame([transaction.dict()])

        # ✅ Rename columns to match model's expected features
        input_data.rename(columns={
            "Amount_INR": "Amount (INR)",
            "Sender_Transaction_Count": "Sender Transaction Count",
            "Receiver_Transaction_Count": "Receiver Transaction Count",
            "Time_Diff_Between_Transactions": "Time Diff Between Transactions"
        }, inplace=True)

        # ✅ Transform necessary features
        input_data["Transaction Amount Log"] = np.log1p(input_data["Amount (INR)"])
        input_data["Is High Amount"] = (input_data["Amount (INR)"] > 50000).astype(int)
        input_data.drop(columns=["Amount (INR)"], inplace=True)  # Drop original amount column

        # ✅ Apply scaling
        input_scaled = scaler.transform(input_data[FEATURES])

        # ✅ Make a prediction
        prediction = model.predict(input_scaled)[0]

        return {"is_fraud": bool(prediction)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Run the FastAPI app with the correct port for Railway
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Railway assigns a dynamic port
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
