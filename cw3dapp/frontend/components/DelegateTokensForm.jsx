import { useState } from 'react'
import { useSigner } from 'wagmi'
import tokenJson from '../assets/MyERC20Token.json'
import { ethers } from 'ethers'
import styles from '../styles/InstructionsComponent.module.css'

export default function DelegateTokensForm() {
  const [address, setAddress] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [error, setError] = useState(null)
  const { data: signer } = useSigner() // <-- Get signer's address

  const handleDelegateTokens = async () => {
    console.log(signer._address)
    try {
      const contract = new ethers.Contract(
        process.env.TOKEN_ADDRESS,
        tokenJson.abi,
        signer
      )

      // No need to sign the transaction, just send it
      const tx = await contract.delegate(address)

      // You can still catch events or transaction hashes here, if needed
      console.log(tx.hash)
      setTransaction(tx)
      setError(null)
    } catch (error) {
      console.error(error)
      setTransaction(null)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div>
      <p>Enter an address to delegate your token to get voting power</p>
      <input
        type="text"
        value={address}
        className={styles.inputField}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button className={styles.buttonField} onClick={handleDelegateTokens}>
        Delegate Tokens
      </button>
      {transaction && (
        <div>
          <p>Delegate Tokens Result:</p>
          <p>
            Transaction Hash:{' '}
            <a
              target="blank"
              href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
            >
              {transaction.hash}
            </a>
          </p>
          {/* Display additional transaction details as needed */}
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  )
}
