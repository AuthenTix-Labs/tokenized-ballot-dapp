// pages/api/wagmi.ts

import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await axios.get('http://localhost:3000/wagmi')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve injected signer' })
  }
}
