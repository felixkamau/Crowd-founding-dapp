import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const WalletButton = ({ onConnect, onDisconnect }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);

    // Check if MetaMask is installed
    const checkMetaMask = () => typeof window.ethereum !== 'undefined';

    // Connect Wallet function
    const connectWallet = async () => {
        if (!checkMetaMask()) {
            alert("MetaMask is not installed.");
            return;
        }

        try {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(newProvider);
            const accounts = await newProvider.send("eth_requestAccounts", []);
            const connectedAccount = accounts[0];
            setAccount(connectedAccount);
            onConnect(connectedAccount); // Notify parent about the connection

            // Store account information only after user explicitly connects
            localStorage.setItem("connectedAccount", connectedAccount);

            toast.success(`Connected: ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    };

    // Handle account changes and disconnections
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                const account = accounts[0];
                setAccount(account);
                localStorage.setItem("connectedAccount", account); // Update stored account info
                onConnect(account); // Notify parent about the connection
                toast.info(`Account changed: ${account.slice(0, 6)}...${account.slice(-4)}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                setAccount(null);
                localStorage.removeItem("connectedAccount"); // Remove stored account info
                onDisconnect(); // Notify parent about the disconnection
                toast.warn("Disconnected", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };

        if (provider) {
            provider.on("accountsChanged", handleAccountsChanged);

            // Check accounts on initial render
            provider.listAccounts().then((accounts) => {
                if (accounts.length > 0) {
                    handleAccountsChanged(accounts);
                }
            });

            // Clean up the event listener on component unmount
            return () => {
                provider.removeListener("accountsChanged", handleAccountsChanged);
            };
        }
    }, [onConnect, onDisconnect, provider]);

    useEffect(() => {
        // Retrieve account from storage only if explicitly connected
        const savedAccount = localStorage.getItem("connectedAccount");
        if (savedAccount) {
            setAccount(savedAccount);
            onConnect(savedAccount); // Notify parent about the restored connection
            toast.info(`Restored: ${savedAccount.slice(0, 6)}...${savedAccount.slice(-4)}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [onConnect]);

    // Disconnect Wallet function
    const disconnectWallet = () => {
        setAccount(null);
        localStorage.removeItem("connectedAccount");
        onDisconnect(); // Notify parent about the disconnection
        toast.warn("Disconnected Wallet", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={account ? disconnectWallet : connectWallet}
                className="bg-blue-500 text-white font-bold py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base md:text-lg"
            >
                {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </button>
            <ToastContainer />
        </div>
    );
};

export default WalletButton;
