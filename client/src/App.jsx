import { useState, useCallback } from 'react';
import ProjectForm from './components/ProjectForm';
import WalletButton from './components/WalletButton';

const App = () => {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(null);

  const handleConnect = useCallback((provider) => {
    setConnected(true);
    setProvider(provider); // Set the provider when connected
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnected(false);
    setProvider(null); // Reset the provider when disconnected
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen">
      <header className="p-3 text-white flex justify-between">
        <h1 className="text-xl">Crowdfund</h1>
        <WalletButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
      </header>

      {connected && provider && <ProjectForm provider={provider} />}
    </div>
  );
}

export default App;
