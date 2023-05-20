import { ethers } from 'ethers'

export async function getInjectedSigner() {
  if (typeof window !== 'undefined' && window.ethereum) {
    // Request access to the user's MetaMask accounts
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    // Create a signer using the injected provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    return signer
  } else {
    throw new Error('Injected Ethereum provider not found')
  }
}
