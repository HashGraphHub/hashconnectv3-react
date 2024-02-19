import "./App.css";
import { useEffect, useState } from "react";

import { HashConnect, HashConnectConnectionState } from "hashconnect";
import { LedgerId } from "@hashgraph/sdk";

const appMetadata = {
  name: "Hashgraph Hub Test",
  description: "Testing Hashgraph Hub hashconnect",
  icons: ["<Image url>"],
  url: "<Dapp url>",
};

function App() {
  const [pairingData, setPairingData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    HashConnectConnectionState.Disconnected
  );
  const [hashconnect, setHashconnect] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    //create the hashconnect instance
    const hashconnect = new HashConnect(
      LedgerId.TESTNET,
      process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
      appMetadata,
      true
    );

    //register events
    hashconnect.pairingEvent.on((newPairing) => {
      setPairingData(newPairing);
    });

    hashconnect.disconnectionEvent.on((data) => {
      setPairingData(null);
    });

    hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
      setConnectionStatus(connectionStatus);
    });

    //initialize
    await hashconnect.init();

    setHashconnect(hashconnect);
  };

  const disconnect = () => {
    hashconnect.disconnect();
  };

  const connect = async () => {
    await hashconnect.openPairingModal();
  };

  return (
    <div className="App">
      <h1>Hello world</h1>
      <p>Pairing data: {JSON.stringify(pairingData)}</p>
      <p>Connection status: {connectionStatus}</p>

      <button onClick={connect}>Open pairing modal</button>

      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}

export default App;
