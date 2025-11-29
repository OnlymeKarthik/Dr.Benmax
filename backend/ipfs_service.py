import os
import requests
from dotenv import load_dotenv
from services.encryption import encryption_service

load_dotenv()

class IPFSService:
    def __init__(self):
        self.api_key = os.getenv("PINATA_API_KEY")
        self.secret_key = os.getenv("PINATA_SECRET_API_KEY")
        
        # Use centralized encryption service
        self.encryption_service = encryption_service

    def encrypt_data(self, data: bytes) -> bytes:
        """Encrypt data using centralized encryption service"""
        return self.encryption_service.encrypt(data)

    def decrypt_data(self, encrypted_data: bytes) -> bytes:
        """Decrypt data using centralized encryption service"""
        return self.encryption_service.decrypt(encrypted_data)

    def upload(self, file_content: bytes, filename: str = "claim_doc.pdf") -> str:
        """
        Encrypt and upload file to IPFS via Pinata
        Returns: IPFS Hash (CID)
        """
        if not self.api_key or not self.secret_key:
            print("⚠️  Pinata credentials missing. Using Mock IPFS.")
            return f"QmMockHash{os.urandom(4).hex()}"

        # 1. Encrypt
        encrypted_content = self.encrypt_data(file_content)
        
        # 2. Upload to Pinata
        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        headers = {
            "pinata_api_key": self.api_key,
            "pinata_secret_api_key": self.secret_key
        }
        files = {
            'file': (filename, encrypted_content)
        }
        
        try:
            response = requests.post(url, files=files, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()['IpfsHash']
        except Exception as e:
            print(f"❌ IPFS Upload failed: {e}")
            return f"QmError{os.urandom(4).hex()}"
    
    def retrieve(self, ipfs_hash: str) -> bytes:
        """Retrieve and decrypt file from IPFS"""
        gateway_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
        
        try:
            response = requests.get(gateway_url, timeout=30)
            response.raise_for_status()
            encrypted_content = response.content
            return self.decrypt_data(encrypted_content)
        except Exception as e:
            print(f"❌ IPFS Retrieval failed: {e}")
            raise

ipfs_service = IPFSService()
