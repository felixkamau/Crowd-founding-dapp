import { ethers } from "ethers";
import ContractABI from '../../artifacts/contracts/CrowdWorks.sol/CrowdWorks.json'

// Address for the deployed contract
export const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const CONTRACT_ABI = ContractABI.abi;
export const PROVIDER = new ethers.providers.Web3Provider(window.ethereum);
export const SIGNER = PROVIDER.getSigner();

// export const connect = async () => {
//     const _provider = PROVIDER;
//     const _contractAddress = CONTRACT_ADDRESS;
//     const _contractABI = CONTRACT_ABI;
//     const _signer = _provider.getSigner();
//     const _contract = new ethers.Contract(
//         _contractAddress,
//         _contractABI,
//         _signer
//     );
// }