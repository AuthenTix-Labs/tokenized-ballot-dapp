import React, { useState } from 'react'
import axios from 'axios'

const DelegateToken = () => {
  const [address, setAddress] = useState('')
  const [successResponse, setSuccessResponse] = useState(null)
  const [error, setError] = useState(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const handleDelegate = async () => {
    setIsButtonDisabled(true) // Disable the button
    try {
      const response = await axios.post(
        'http://localhost:3001/delegate-tokens',
        { address }
      )
      setSuccessResponse(response.data.result)
      setError(null)
    } catch (error) {
      setSuccessResponse(null)
      setError('Error delegating tokens')
    } finally {
      setIsButtonDisabled(false) // Enable the button again
    }
  }

  const etherscanUrl = successResponse
    ? `https://sepolia.etherscan.io/tx/${successResponse.hash}`
    : ''

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address"
      />
      <button onClick={handleDelegate} disabled={isButtonDisabled}>
        Delegate
      </button>

      {error && <p>{error}</p>}
      {successResponse && (
        <div>
          <p>Delegation successful!</p>
          <p>To: {successResponse.to}</p>
          <p>
            Transaction Hash:
            <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
              {successResponse.hash}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default DelegateToken
