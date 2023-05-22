import axios from 'axios'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styles from '../styles/ProposalComponent.module.css'

const ProposalComponent = () => {
  const [proposals, setProposals] = useState([])
  const [fetching, setFetching] = useState(true)
  const [querying, setQuerying] = useState(false)
  const [winner, setWinner] = useState(null) // State variable to store the winner

  const fetchProposalVoteCount = async (index) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/proposals/${index}`
      )
      const voteCount = ethers.utils.formatEther(response.data.voteCount)
      const formattedVoteCount = parseFloat(voteCount).toFixed(2)

      const parsedProposal = {
        name: ethers.utils.parseBytes32String(response.data.name),
        voteCount: formattedVoteCount,
      }

      return parsedProposal
    } catch (error) {
      if (error.response && error.response.status === 500) {
        // Proposal not found, handle accordingly
      } else {
        console.error('Error:', error)
      }
    }
  }

  const fetchData = async () => {
    const fetchedProposals = []
    let index = 0
    let continueFetching = true

    while (continueFetching) {
      const proposal = await fetchProposalVoteCount(index)
      if (proposal) {
        fetchedProposals.push(proposal)
      } else {
        continueFetching = false // Stop fetching if no proposal is found
      }
      index++
    }

    setProposals(fetchedProposals)

    // Find the winner with maximum votes
    const maxVotes = Math.max(
      ...fetchedProposals.map((proposal) => parseFloat(proposal.voteCount))
    )
    const winningProposal = fetchedProposals.find(
      (proposal) => parseFloat(proposal.voteCount) === maxVotes
    )

    setWinner(winningProposal) // Update the winner state variable
    setFetching(false) // Set fetching status to false once data is fetched
  }

  const handleQueryVotes = async () => {
    setQuerying(true)
    await fetchData()
    setQuerying(false)
  }

  return (
    <div>
      <h1>Proposals</h1>
      <table className={styles.styledTable}>
        <thead>
          <tr>
            <th>Index</th>
            <th>Name</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{proposal.name}</td>
              <td>{proposal.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className={styles.buttonField}
        onClick={handleQueryVotes}
        disabled={querying}
      >
        Query Votes
      </button>
      <br />
      <br />
      {winner && (
        <div>
          <h2>Winner:</h2>
          <p>Name: {winner.name}</p>
          <p>Votes: {winner.voteCount}</p>
        </div>
      )}
    </div>
  )
}

export default ProposalComponent
