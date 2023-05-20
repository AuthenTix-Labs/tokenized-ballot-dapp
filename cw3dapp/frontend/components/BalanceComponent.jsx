import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import { useSigner } from 'wagmi'

const BalanceComponent = () => {
  const [balance, setBalance] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: signer } = useSigner() // <-- Get signer's address

  const fetchBalance = async () => {
    try {
      if (!signer) {
        setBalance('')
        return
      }
      setIsLoading(true) // Set loading state to true
      const response = await axios.get(
        `http://localhost:3001/balance/${signer._address}`
      ) // <-- Use signer's address
      const balanceValue = ethers.BigNumber.from(response.data.hex)
      const formattedBalance = ethers.utils.formatEther(balanceValue)
      setBalance(formattedBalance)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setIsLoading(false) // Set loading state back to false
    }
  }

  useEffect(() => {
    fetchBalance() // Fetch initial balance
  }, [signer]) // <-- Update balance when signer changes

  const handleQuery = () => {
    fetchBalance() // Fetch balance on demand
  }

  return (
    <div>
      Balance: {balance}
      <button onClick={handleQuery} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Query Balance'}
      </button>
    </div>
  )
}

export default BalanceComponent
