import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
from imblearn.over_sampling import SMOTE

# ✅ Load Cleaned Datasets
df1 = pd.read_csv("dataset\expanded_transactions_1.csv")
df2 = pd.read_csv("dataset\expanded_transactions_2.csv")
df = pd.concat([df1, df2], ignore_index=True)

# ✅ Convert categorical data to numeric
encoder = LabelEncoder()
df["Sender UPI ID"] = encoder.fit_transform(df["Sender UPI ID"])
df["Receiver UPI ID"] = encoder.fit_transform(df["Receiver UPI ID"])
df["Status"] = df["Status"].map({"SUCCESS": 0, "FAILED": 1})  

# ✅ Feature Engineering
df["Transaction Amount Log"] = np.log1p(df["Amount (INR)"])
df["Sender Transaction Count"] = df.groupby("Sender UPI ID")["Transaction ID"].transform("count")
df["Receiver Transaction Count"] = df.groupby("Receiver UPI ID")["Transaction ID"].transform("count")
df["Timestamp"] = pd.to_datetime(df["Timestamp"])
df["Time Diff Between Transactions"] = df.groupby("Sender UPI ID")["Timestamp"].diff().dt.total_seconds()
df["Time Diff Between Transactions"] = df["Time Diff Between Transactions"].fillna(df["Time Diff Between Transactions"].median())
df["Is High Amount"] = (df["Amount (INR)"] > df["Amount (INR)"].quantile(0.95)).astype(int)

# ✅ Feature Selection
features = ["Transaction Amount Log", "Sender Transaction Count", "Receiver Transaction Count",
            "Time Diff Between Transactions", "Is High Amount", "Status"]
X = df[features]
y = df["is_fraud"]

# ✅ Feature Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ✅ Apply SMOTE to balance fraud cases
smote = SMOTE(sampling_strategy='auto', random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

# ✅ Split Data into Training & Testing Sets
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# ✅ Train Random Forest Model
model = RandomForestClassifier(n_estimators=150, max_depth=12, min_samples_split=5, random_state=42)
model.fit(X_train, y_train)

# ✅ Make Predictions & Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Random Forest Model Accuracy: {accuracy * 100:.2f}%")

# ✅ Save Model & Scaler
joblib.dump(model, "model/fraud_detection_model.pkl")
joblib.dump(scaler, "model/scaler.pkl")
print("✅ Model and Scaler Saved Successfully!")
