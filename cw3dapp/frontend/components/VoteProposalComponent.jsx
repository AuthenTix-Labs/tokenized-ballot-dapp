import { useState } from 'react'
import { vote } from '../pages/api/vote'

export default function Vote() {
  const [proposal, setProposal] = useState('')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await vote(proposal, amount)
    setResult(result)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Proposal:
        <input
          type="number"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
        />
      </label>
      <label>
        Amount:
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <button type="submit">Vote</button>
      {result && <p>{result}</p>}
    </form>
  )
}
