import axios from 'axios'

export async function vote(proposal: number, amount: string) {
  const response = await axios.post('/api/vote', { proposal, amount })
  return response.data.result
}
