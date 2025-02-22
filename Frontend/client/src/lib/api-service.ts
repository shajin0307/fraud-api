import { Transaction } from "@shared/schema";

const API_URL = "https://fraud-api-1.onrender.com";

interface FraudPredictionInput {
  Amount_INR: number;
  Sender_Transaction_Count: number;
  Receiver_Transaction_Count: number;
  Time_Diff_Between_Transactions: number;
  Status: number;
}

export async function getFraudPrediction(transaction: Transaction): Promise<boolean> {
  try {
    const input: FraudPredictionInput = {
      Amount_INR: transaction.amount,
      Sender_Transaction_Count: 5, // Mock data, should be replaced with actual counts
      Receiver_Transaction_Count: 3, // Mock data
      Time_Diff_Between_Transactions: 1200, // Mock data in seconds
      Status: transaction.status === "approved" ? 1 : 0,
    };

    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Failed to get fraud prediction");
    }

    const data = await response.json();
    return data.is_fraud;
  } catch (error) {
    console.error("Error getting fraud prediction:", error);
    return false;
  }
}

export async function checkApiStatus(): Promise<boolean> {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.message.includes("Running");
  } catch (error) {
    console.error("Error checking API status:", error);
    return false;
  }
}
