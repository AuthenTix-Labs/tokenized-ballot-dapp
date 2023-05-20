import { ethers } from 'ethers'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { address } = req.body
    const pKey = process.env.PRIVATE_KEY
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    )
    const wallet = new ethers.Wallet(pKey, provider)
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      process.env.CONTRACT_ABI,
      wallet
    )

    try {
      const receipt = await contract.mint(
        address,
        ethers.utils.parseUnits('0.01')
      )
      res.status(200).json(receipt)
    } catch (error) {
      res.status(500).json({ error: 'Failed to request tokens' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
