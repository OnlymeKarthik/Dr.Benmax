import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [balance, setBalance] = useState('0');
    const [connecting, setConnecting] = useState(false);

    const POLYGON_MAINNET = {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com']
    };

    const POLYGON_MUMBAI = {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai Testnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
    };

    useEffect(() => {
        if (window.ethereum) {
            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            // Check if already connected
            checkConnection();
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    const checkConnection = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.length > 0) {
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();
                const balance = await provider.getBalance(address);

                setProvider(provider);
                setSigner(signer);
                setAccount(address);
                setChainId(network.chainId.toString());
                setBalance(ethers.formatEther(balance));
            }
        } catch (error) {
            console.error('Failed to check connection:', error);
        }
    };

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            disconnect();
        } else {
            setAccount(accounts[0]);
            checkConnection();
        }
    };

    const handleChainChanged = () => {
        window.location.reload();
    };

    const connect = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask to use this feature!');
            return { success: false, error: 'MetaMask not installed' };
        }

        try {
            setConnecting(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(address);

            setProvider(provider);
            setSigner(signer);
            setAccount(address);
            setChainId(network.chainId.toString());
            setBalance(ethers.formatEther(balance));

            return { success: true };
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            return { success: false, error: error.message };
        } finally {
            setConnecting(false);
        }
    };

    const disconnect = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
        setBalance('0');
    };

    const switchToPolygon = async (testnet = true) => {
        const network = testnet ? POLYGON_MUMBAI : POLYGON_MAINNET;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network.chainId }],
            });
            return { success: true };
        } catch (error) {
            // Chain not added, try to add it
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [network]
                    });
                    return { success: true };
                } catch (addError) {
                    return { success: false, error: addError.message };
                }
            }
            return { success: false, error: error.message };
        }
    };

    const value = {
        account,
        provider,
        signer,
        chainId,
        balance,
        connecting,
        connect,
        disconnect,
        switchToPolygon,
        isConnected: !!account
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
