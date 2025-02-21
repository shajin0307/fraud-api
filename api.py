from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# ✅ Load trained model & scaler
model = joblib.load("model/fraud_detection_model.pkl")
scaler = joblib.load("model/scaler.pkl")

# ✅ Define required features
features = ["Transaction Amount Log", "Sender Transaction Count", "Receiver Transaction Count",
            "Time Diff Between Transactions", "Is High Amount", "Status"]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # ✅ Convert input into a DataFrame
        input_data = pd.DataFrame([data])

        # ✅ Transform necessary features
        input_data["Transaction Amount Log"] = np.log1p(input_data["Amount (INR)"])
        input_data["Is High Amount"] = (input_data["Amount (INR)"] > 50000).astype(int)
        input_data = input_data.drop(columns=["Amount (INR)"])  # Drop original amount column

        # ✅ Apply scaling
        input_scaled = scaler.transform(input_data[features])

        # ✅ Make a prediction
        prediction = model.predict(input_scaled)[0]

        return jsonify({"is_fraud": bool(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/')
def home():
    return "✅ Pre-Transaction Fraud Detection API is Running!"

if __name__ == '__main__':
    app.run(debug=True)
