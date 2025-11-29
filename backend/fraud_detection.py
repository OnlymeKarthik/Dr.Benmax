import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

class FraudDetector:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self._train_dummy_model()

    def _train_dummy_model(self):
        """Train a model on synthetic data for demonstration"""
        # Features: [Amount, Hospital_Trust_Score, Patient_Risk_Score, Diagnosis_Risk_Score]
        X = np.array([
            [500, 0.9, 0.1, 0.1],   # Low risk
            [1000, 0.8, 0.2, 0.2],  # Low risk
            [5000, 0.7, 0.3, 0.3],  # Medium risk
            [10000, 0.9, 0.1, 0.1], # High amount, but trusted hospital
            [20000, 0.2, 0.8, 0.9], # High risk: High amount, low trust, high patient risk
            [5000, 0.1, 0.9, 0.8],  # High risk: Suspicious hospital
            [100, 0.95, 0.05, 0.05],# Very low risk
            [50000, 0.5, 0.5, 0.5], # Medium-High risk
        ])
        
        # Labels: 0 = Legitimate, 1 = Fraudulent
        y = np.array([0, 0, 0, 0, 1, 1, 0, 1])

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        self.is_trained = True
        print("[+] Fraud Detection Model Trained on Synthetic Data")

    def predict(self, amount, hospital_trust=0.8, patient_risk=0.2, diagnosis_risk=0.2):
        """
        Predict fraud probability.
        Returns: (is_fraud, fraud_score)
        """
        if not self.is_trained:
            return False, 0

        features = np.array([[amount, hospital_trust, patient_risk, diagnosis_risk]])
        
        # Get probability of fraud (class 1)
        fraud_prob = self.model.predict_proba(features)[0][1]
        fraud_score = int(fraud_prob * 100)
        
        is_fraud = fraud_score > 50
        
        return is_fraud, fraud_score

fraud_detector = FraudDetector()
