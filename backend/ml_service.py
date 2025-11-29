import re
import random
from typing import Dict, Any, Tuple
from fraud_detection import fraud_detector

class MLService:
    def __init__(self):
        self.fraud_detector = fraud_detector
        print("✅ ML Service Initialized")

    async def process_claim(self, claim_data: Dict[str, Any]) -> Tuple[bool, int, Dict[str, Any]]:
        """
        Process a claim:
        1. Extract entities (Mock OCR + Regex NLP)
        2. Detect fraud (Real ML Model)
        """
        
        # 1. Mock OCR & NLP (Extracting data from "diagnosis" text)
        # In a real app, we would process an image here.
        diagnosis_text = claim_data.get("diagnosis", "")
        extracted_data = self._extract_entities(diagnosis_text)
        
        # 2. Fraud Detection
        amount = claim_data.get("amount", 0)
        
        # Calculate risk scores based on extracted data
        hospital_trust = 0.9 # Mock
        patient_risk = 0.1   # Mock
        diagnosis_risk = 0.1
        
        if "cancer" in diagnosis_text.lower() or "surgery" in diagnosis_text.lower():
            diagnosis_risk = 0.3
        if "cosmetic" in diagnosis_text.lower():
            diagnosis_risk = 0.9

        is_fraud, fraud_score = self.fraud_detector.predict(
            amount=amount,
            hospital_trust=hospital_trust,
            patient_risk=patient_risk,
            diagnosis_risk=diagnosis_risk
        )
        
        return not is_fraud, fraud_score, extracted_data

    def _extract_entities(self, text: str) -> Dict[str, Any]:
        """
        Extract medical entities using Regex (Fallback for SpaCy)
        """
        entities = {
            "dates": [],
            "amounts": [],
            "diseases": []
        }
        
        # Extract Dates (DD/MM/YYYY or YYYY-MM-DD)
        date_pattern = r'\b\d{2}/\d{2}/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b'
        entities["dates"] = re.findall(date_pattern, text)
        
        # Extract Amounts (Currency symbols or numbers)
        amount_pattern = r'[\$€₹]\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
        entities["amounts"] = re.findall(amount_pattern, text)
        
        # Extract common diseases (Simple keyword matching)
        common_diseases = ["fever", "cancer", "diabetes", "fracture", "surgery", "infection", "covid"]
        entities["diseases"] = [d for d in common_diseases if d in text.lower()]
        
        return entities

ml_service = MLService()
