import { useNetwork, useSigner, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import styles from '../styles/InstructionsComponent.module.css'
import Router, { useRouter } from 'next/router'
import TokenRequestForm from './TokenRequestForm'
import VotesComponent from './VotesComponent'
import BalanceComponent from '../components/BalanceComponent'
import { useContext } from 'react'
import { AddressContext } from '../components/context/AddressContext'
import ProposalComponent from './ProposalsComponent'

export default function InstructionsComponent() {
  const [signer, setSigner] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSigner = async () => {
      try {
        const response = await fetch('/api/wagmi')
        const data = await response.json()
        setSigner(data.signer)
      } catch (error) {
        console.error('Failed to fetch injected signer', error)
      }
    }

    fetchSigner()
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <h1>
          my<span>-awesome-web3-dapp</span>
        </h1>
      </header>

      <div className={styles.buttons_container}>
        <WalletInfo></WalletInfo>
      </div>
      <div className={styles.footer}>
        <h1>Footer</h1>
      </div>
    </div>
  )
  function WalletInfo() {
    const { address = signer._address, setAddress } = useContext(AddressContext)

    const { data: signer, isError, isLoading } = useSigner()
    const { chain, chains } = useNetwork()
    if (signer)
      return (
        <>
          <p>Your account address is {signer._address}</p>

          <WalletBalance></WalletBalance>
          <TokenRequestForm setAddress={setAddress} address={address} />
          <BalanceComponent address={address} />
          <VotesComponent address={address} />
          {/* <DelegateComponent /> */}
          <ProposalComponent />
        </>
      )
    else if (isLoading)
      return (
        <>
          <p>Loading...</p>
        </>
      )
    else
      return (
        <>
          <p>Connect account to continue</p>
        </>
      )
  }

  function WalletBalance() {
    const { data: signer } = useSigner()
    const { data, isError, isLoading } = useBalance({
      address: signer._address,
    })

    if (isLoading) return <div>Fetching balance…</div>
    if (isError) return <div>Error fetching balance</div>
    return (
      <div>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    )
  }

  function signMessage(signer, message) {
    signer.signMessage(message).then(
      (signature) => {
        console.log(signature)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  function RequestTokens() {
    const [txData, setTxData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    if (txData)
      return (
        <div>
          <p>Transaction completed!</p>
          <a
            href={'https://sepolia.etherscan.io/tx/' + txData.hash}
            target="_blank"
          >
            {txData.hash}
          </a>
        </div>
      )
    if (isLoading) return <p>Requesting tokens to be minted...</p>
  }

  function requestTokens(signer, signature, setLoading, setTxData) {
    setLoading(true)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: signer._address, signature: signature }),
    }
    fetch('http://localhost:3001/request-tokens', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setTxData(data)
        setLoading(true)
      })
  }
}
