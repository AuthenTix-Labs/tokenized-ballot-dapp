import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import { useSigner } from 'wagmi'
import styles from '../styles/InstructionsComponent.module.css'

const VotesComponent = () => {
  const [votes, setVotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: signer } = useSigner() // <-- Get signer's address

  const fetchVotes = async () => {
    try {
      if (!signer) {
        setVotes('')
        return
      }
      setIsLoading(true) // Set loading state to true
      const response = await axios.get(
        `http://localhost:3001/votes/${signer._address}`
      ) // <-- Use signer's address
      const votesValue = ethers.utils.formatEther(response.data.hex)
      const formattedVotes = votesValue.toString()
      setVotes(formattedVotes)
    } catch (error) {
      console.error('Error fetching votes:', error)
    } finally {
      setIsLoading(false) // Set loading state back to false
    }
  }

  useEffect(() => {
    fetchVotes() // Fetch initial votes
  }, [signer]) // <-- Update votes when signer changes

  const handleQuery = () => {
    fetchVotes() // Fetch votes on demand
  }

  return (
    <div>
      Votes: {votes}
      <div>
        <button
          className={styles.buttonField}
          onClick={handleQuery}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Query Votes'}
        </button>
      </div>
    </div>
  )
}

export default VotesComponent
