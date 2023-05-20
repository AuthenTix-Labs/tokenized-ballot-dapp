import { Wallet } from 'wagmi'

export default async function handler(req, res) {
  try {
    const { address } = req.body

    // Check if the injected Ethereum provider is available
    if (typeof window !== 'undefined' && window.ethereum) {
      // Request access to the user's MetaMask accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      // Create a wallet using the injected provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      // Use the signer to interact with the contract
      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        process.env.CONTRACT_ABI,
        signer
      )
      const result = await contract.delegate(address)
      res.status(200).json({ result })
    } else {
      throw new Error('Injected Ethereum provider not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}
