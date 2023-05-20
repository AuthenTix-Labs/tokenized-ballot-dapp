import React, { useState, useContext, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import styles from '../styles/TokenRequestForm.module.css'
import { AddressContext } from '../components/context/AddressContext'

const TokenRequestForm = () => {
  const { address, setAddress } = useContext(AddressContext)
  const [loading, setLoading] = useState(false)
  const [responseData, setResponseData] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true) // Start loading

    try {
      const response = await axios.post(
        'http://localhost:3001/request-tokens',
        {
          address,
        }
      )
      setResponseData(response.data)
    } catch (error) {
      setError(error.message)
    }

    setLoading(false) // Stop loading
  }

  const handleAddressChange = (e) => {
    setAddress(e.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Please enter address to mint 100 tokens:
          <input
            type="text"
            value={address} // <-- Update here
            onChange={handleAddressChange}
            className={styles.inputField}
          />
        </label>
        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Minting...' : 'Request Tokens'}
        </button>
      </form>
      <br />
      {loading && (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      )}
      {!loading && responseData && (
        <div>
          <h3>Response Data:</h3>
          <p>
            Hash:{' '}
            <a
              target="blank"
              href={`https://sepolia.etherscan.io/tx/${responseData.hash}`}
            >
              {responseData.hash}
            </a>
          </p>
          <p>Successfully minted 100 tokens.</p>
        </div>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  )
}

export default TokenRequestForm
