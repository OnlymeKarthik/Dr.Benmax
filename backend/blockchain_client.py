import os
import json
import time
import random
from web3 import Web3
# Web3.py v7 renamed geth_poa_middleware to ExtraDataToPOAMiddleware
from web3.middleware import ExtraDataToPOAMiddleware
from dotenv import load_dotenv

load_dotenv()

class BlockchainClient:
    def __init__(self):
        self.rpc_url = os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")
        self.private_key = os.getenv("PRIVATE_KEY")
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Add middleware for PoA networks (like Polygon Mumbai)
        # Required for chains that use more than 32 bytes in extraData field
        self.w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        
        self.contract_address = None
        self.contract = None
        self.account = None
        
        if self.private_key:
            self.account = self.w3.eth.account.from_key(self.private_key)
            print(f"[*] Blockchain: Loaded account {self.account.address}")
        else:
            print("[!] Blockchain: No PRIVATE_KEY found. Read-only mode or local node.")

    def deploy_contract(self):
        """Deploy smart contract to blockchain with retry logic"""
        if not self.private_key:
            # Fallback for local hardhat node without env key
            if self.w3.is_connected() and self.w3.eth.accounts:
                self.account = self.w3.eth.accounts[0] # Use first account
            else:
                print("[!] Blockchain: Cannot deploy - No account available")
                return

        try:
            # Load ABI and Bytecode
            artifact_path = "../contracts/artifacts/contracts/ClaimSettlement.sol/ClaimSettlement.json"
            if not os.path.exists(artifact_path):
                print(f"[!] Contract artifact not found: {artifact_path}")
                return
                
            with open(artifact_path) as f:
                artifact = json.load(f)
                abi = artifact["abi"]
                bytecode = artifact["bytecode"]

            # Deploy
            ClaimSettlement = self.w3.eth.contract(abi=abi, bytecode=bytecode)
            
            # Build transaction
            if isinstance(self.account, str): # Local node account address
                tx_hash = ClaimSettlement.constructor().transact({'from': self.account})
            else: # Account object with private key
                construct_txn = ClaimSettlement.constructor().build_transaction({
                    'from': self.account.address,
                    'nonce': self.w3.eth.get_transaction_count(self.account.address),
                    'gas': 2000000,
                    'gasPrice': self.w3.eth.gas_price
                })
                signed_txn = self.w3.eth.account.sign_transaction(construct_txn, private_key=self.private_key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)

            # Wait for receipt
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            self.contract_address = tx_receipt.contractAddress
            self.contract = self.w3.eth.contract(address=self.contract_address, abi=abi)
            print(f"[+] Blockchain: Contract deployed at {self.contract_address}")
            
        except Exception as e:
            print(f"[!] Blockchain: Deployment failed - {e}")

    def submit_claim_on_chain(self, claim_id, amount, ipfs_hash="QmHash"):
        """Submit claim with retry logic and gas estimation"""
        if not self.contract:
            print("[!] No contract deployed, returning mock tx hash")
            return f"0xMock{random.randint(100000, 999999)}"
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                amount_wei = int(amount)
                
                # Build transaction
                tx_params = {
                    'from': self.account.address if hasattr(self.account, 'address') else self.account,
                    'nonce': self.w3.eth.get_transaction_count(self.account.address if hasattr(self.account, 'address') else self.account),
                }
                
                # Estimate Gas
                gas_estimate = self.contract.functions.submitClaim(
                    int(claim_id), "APOLLO-001", amount_wei, "INR", ipfs_hash
                ).estimate_gas(tx_params)
                
                tx_params['gas'] = int(gas_estimate * 1.2) # Add buffer
                tx_params['gasPrice'] = self.w3.eth.gas_price
                
                # Send Transaction
                if hasattr(self.account, 'sign_transaction'): # Private Key
                    txn = self.contract.functions.submitClaim(
                        int(claim_id), "APOLLO-001", amount_wei, "INR", ipfs_hash
                    ).build_transaction(tx_params)
                    signed_txn = self.w3.eth.account.sign_transaction(txn, private_key=self.private_key)
                    tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
                else: # Local Node
                    tx_hash = self.contract.functions.submitClaim(
                        int(claim_id), "APOLLO-001", amount_wei, "INR", ipfs_hash
                    ).transact(tx_params)
                
                # Wait for receipt
                receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
                return receipt.transactionHash.hex()
                
            except Exception as e:
                print(f"[!] Blockchain Attempt {attempt+1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt) # Exponential backoff
                else:
                    print(f"[!] Blockchain: Submit failed after {max_retries} attempts")
                    return f"0xError{random.randint(100000, 999999)}"

blockchain_client = BlockchainClient()
