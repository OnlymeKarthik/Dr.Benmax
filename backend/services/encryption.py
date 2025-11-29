import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

class EncryptionService:
    """Centralized encryption service with proper key management"""
    
    def __init__(self):
        # Require encryption key from environment
        self.encryption_key = os.getenv("ENCRYPTION_KEY")
        
        if not self.encryption_key:
            raise ValueError(
                "ENCRYPTION_KEY environment variable is required. "
                "Generate one with: python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'"
            )
        
        try:
            self.cipher_suite = Fernet(self.encryption_key.encode())
        except Exception as e:
            raise ValueError(f"Invalid ENCRYPTION_KEY: {e}")
        
        print("✅ Encryption service initialized with valid key")
    
    def encrypt(self, data: bytes) -> bytes:
        """Encrypt data using AES-256 (Fernet)"""
        if not isinstance(data, bytes):
            raise TypeError("Data must be bytes")
        return self.cipher_suite.encrypt(data)
    
    def decrypt(self, encrypted_data: bytes) -> bytes:
        """Decrypt data"""
        if not isinstance(encrypted_data, bytes):
            raise TypeError("Encrypted data must be bytes")
        return self.cipher_suite.decrypt(encrypted_data)
    
    def encrypt_string(self, text: str) -> str:
        """Encrypt string and return base64-encoded result"""
        encrypted = self.encrypt(text.encode('utf-8'))
        return encrypted.decode('utf-8')
    
    def decrypt_string(self, encrypted_text: str) -> str:
        """Decrypt base64-encoded string"""
        decrypted = self.decrypt(encrypted_text.encode('utf-8'))
        return decrypted.decode('utf-8')
    
    def rotate_key(self, new_key: str, old_data: bytes) -> bytes:
        """Rotate encryption key by re-encrypting data"""
        # Decrypt with old key
        decrypted = self.decrypt(old_data)
        
        # Create new cipher with new key
        new_cipher = Fernet(new_key.encode())
        
        # Encrypt with new key
        return new_cipher.encrypt(decrypted)

# Global encryption service instance
encryption_service = EncryptionService()
