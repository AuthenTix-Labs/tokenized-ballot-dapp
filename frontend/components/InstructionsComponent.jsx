import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance, useEnsName } from "wagmi";
import { useState, useEffect } from "react";

export default function InstructionsComponent() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <h1>
          My<span>-DAPP</span>
        </h1>
      </header>

      <div className={styles.buttons_container}>
        <>
          <PageBody></PageBody>
        </>
      </div>

      <div className={styles.footer}>
        <div className={styles.icons_container}>
          <div>
            <a
              href="https://github.com/alchemyplatform/create-web3-dapp"
              target={"_blank"}
            >
              Leave a star on Github
            </a>
          </div>
          <div>
            <a href="https://twitter.com/AlchemyPlatform" target={"_blank"}>
              Follow us on Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageBody() {
  return (
    <>
      <WalletInfo></WalletInfo>
      <RequestTokens></RequestTokens>
    </>
  );
}

function WalletInfo() {
  const { data: signer, isError, isLoading } = useSigner();
  const { chain, chains } = useNetwork();
  if (signer)
    return (
      <>
        <p>Your account address is {signer._address}</p>
        <p>Connected to the {chain.name} network</p>
        <button
          onClick={() => {
            signMessage(signer, "I love potatoes");
          }}
        >
          Sign
        </button>
        <WalletBalance></WalletBalance>
      </>
    );
  else if (isLoading)
    return (
      <>
        <p>Loading...</p>
      </>
    );
  else
    return (
      <>
        <p>Connect account to continue</p>
      </>
    );
}

function WalletBalance() {
  const { data: signer } = useSigner();
  const { data, isError, isLoading } = useBalance({
    address: signer._address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}

function WalletEnsName() {
  const { data: signer } = useSigner();
  const { data, isError, isLoading } = useEnsName({
    address: signer._address,
  });

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Name: {data}</div>;
}

function signMessage(signer, message) {
  signer.signMessage(message).then(
    (signature) => {
      console.log(signature);
    },
    (error) => {
      console.log(error);
    }
  );
}

function ApiInfo() {
  // client side fetching offchain data with API
  // https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://random-data-api.com/api/v2/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>{data.username}</h1>
      <p>{data.email}</p>
    </div>
  );
}

function RequestTokens() {
  const { data: signer } = useSigner();
  const [txData, setTxData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  if (txData)
    return (
      <div>
        <p>Transaction Completed</p>
        <a
          href={`https://sepolia.etherscan.io/tx/${txData.hash}`}
          target="_blank"
        >
          View on Etherscan
        </a>
      </div>
    );

  if (isLoading) return <p>Requesting tokens to be minted...</p>;

  return (
    <div>
      <button
        onClick={() => {
          requestTokens(signer, "signature", setLoading, setTxData);
        }}
      >
        Request Tokens
      </button>
    </div>
  );
}

function requestTokens(signer, signature, setLoading, setTxData) {
  setLoading(true);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: signer._address, signature: signature }),
  };

  fetch("http://localhost:3001/request-tokens", requestOptions)
    .then((res) => res.json())
    .then((data) => {
      setTxData(data);
      setLoading(false);
    });
}
