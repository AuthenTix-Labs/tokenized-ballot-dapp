import { useState } from 'react'
import { useSigner } from 'wagmi'
import ballotJson from '../assets/TokenizedBallot.json'
import { ethers } from 'ethers'
import styles from '../styles/VoteProposalComponent.module.css'

export default function VoteProposalComponent() {
  const [address, setAddress] = useState('')

  const [proposal, setProposal] = useState('')
  const [amount, setAmount] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [error, setError] = useState(null)
  const { data: signer } = useSigner() // <-- Get signer's address

  const handleVoteProposal = async () => {
    console.log(signer._address)
    try {
      const contract = new ethers.Contract(
        process.env.TOKENIZED_CONTRACT_ADDRESS,
        ballotJson.abi,
        signer
      )

      // No need to sign the transaction, just send it
      const tx = await contract.vote(proposal, ethers.utils.parseEther(amount))
      setTransaction(tx)

      // Wait for the transaction to be mined
      const receipt = await tx.wait()

      // Transaction successful
      console.log(receipt.transactionHash)
      setError(null)
      setAmount('')
      setProposal('')
      setTransaction(null) // Enable the vote button again
    } catch (error) {
      console.error(error)
      setTransaction(null)
      setError('An error occurred. Please try again.')
    }
  }

  const isVoteDisabled = transaction !== null

  return (
    <div>
      <p>Please enter the proposal number and amount to vote</p>
      <label htmlFor="proposal">
        <input
          className={styles.inputField}
          type="number"
          value={proposal}
          id="proposal"
          placeholder="proposal number"
          onChange={(e) => setProposal(e.target.value)}
        />
      </label>
      <label htmlFor="amount">
        <input
          className={styles.inputField}
          type="number"
          id="amount"
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <div>
        <button
          className={styles.buttonField}
          onClick={handleVoteProposal}
          disabled={isVoteDisabled}
        >
          Vote
        </button>
      </div>
      {transaction && (
        <div>
          <p>Vote Result:</p>
          <p>
            Transaction Hash:{' '}
            <a
              target="blank"
              href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
            >
              {transaction.hash}
            </a>
          </p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  )
}
