import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { AddressDetails } from './components/AddressDetails';
import { BitExplorer } from './components/BitExplorer';
import { InfoPanel } from './components/InfoPanel';
import { IPv6Address, IPv6Subnet } from './utils/ipv6';
import { SimpleModeCard } from './components/SimpleModeCard';
import { SimpleModeToggle } from './components/SimpleModeToggle';
import { ThreeBitExplorer } from './components/ThreeBitExplorer';
import { TransitionTools } from './components/TransitionTools';
import { ConfigGenerator } from './components/ConfigGenerator';
import { BulkGenerator } from './components/BulkGenerator';
import { EUI64Visualizer } from './components/EUI64Visualizer';
import { SubnetTree } from './components/SubnetTree';
import { SidebarGallery } from './components/SidebarGallery';
import SIMPLE_MODE_DATA from './data/simpleModeContent.json';
import { BottomContent } from './components/BottomContent';
import bottomData from './data/bottomContent.json';

function App() {
  const [address, setAddress] = useState('2001:db8::1');
  const [cidr, setCidr] = useState(64);
  const [viewMode, setViewMode] = useState('2D');
  const [error, setError] = useState(null);
  const [parsedAddress, setParsedAddress] = useState(null);
  const [subnet, setSubnet] = useState(null);
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      if (!address) {
        setError(null);
        setParsedAddress(null);
        setSubnet(null);
        return;
      }

      const ipv6 = new IPv6Address(address);
      setParsedAddress(ipv6);
      setError(null);

      // Only calculate subnet if valid
      try {
        const sub = new IPv6Subnet(address, cidr);
        setSubnet(sub);
      } catch (e) {
        // Subnet error (shouldn't really happen with valid address + slider)
        console.error(e);
      }

    } catch (e) {
      setError(e.message);
      setParsedAddress(null);
      setSubnet(null);
    }
  }, [address, cidr]);

  const getSimpleTypeContent = (type) => {
    switch (type) {
      case 'Global Unicast': return SIMPLE_MODE_DATA.address_type_global_unicast;
      case 'Link-Local': return SIMPLE_MODE_DATA.address_type_link_local;
      case 'Loopback': return SIMPLE_MODE_DATA.address_type_loopback;
      default: return null;
    }
  };

  const { FavoritesPanel } = SidebarGallery({
    onLoadFavorite: (addr, cidrVal) => {
      setAddress(addr);
      setCidr(cidrVal);
    }
  });

  return (
    <Layout headerExtra={
      <div className="flex gap-4 items-center">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-element/80 border border-border text-primary text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all cursor-pointer hover:bg-element backdrop-blur-sm"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="hacker">Hacker</option>
        </select>
        <SimpleModeToggle isSimpleMode={isSimpleMode} onToggle={setIsSimpleMode} />
      </div>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          <FavoritesPanel currentAddress={address} currentCidr={cidr} />

          <section className="glass-card rounded-2xl p-6 shadow-xl">

            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
              <span className="w-1 h-6 accent-bar-red rounded-full"></span>
              <span className="text-gradient-red">Configuration</span>
            </h2>
            <InputSection
              address={address}
              setAddress={setAddress}
              cidr={cidr}
              setCidr={setCidr}
              error={error}
              type={parsedAddress?.type}
            />
          </section>

          <ConfigGenerator address={address} cidr={cidr} />
          <BulkGenerator startAddress={address} cidr={cidr} />



          <TransitionTools />
          <SubnetTree rootAddress={address} rootCidr={cidr} />
        </div>

        <div className="lg:col-span-7 space-y-6">
          {parsedAddress ? (
            <section className="space-y-6 animate-fade-in">
              {isSimpleMode && (
                <div className="animate-fade-in">
                  <SimpleModeCard content={SIMPLE_MODE_DATA.ipv6_what_is} />
                </div>
              )}
              <AddressDetails
                ipv6={parsedAddress}
                subnet={subnet}
                isSimpleMode={isSimpleMode}
                simpleData={SIMPLE_MODE_DATA}
              />
              <InfoPanel
                type={parsedAddress.type}
                isSimpleMode={isSimpleMode}
                simpleTypeContent={getSimpleTypeContent(parsedAddress.type)}
              />

              <div className="bg-main/50 p-1 rounded-xl flex items-center justify-between mb-2">
                <h3 className="text-primary font-medium px-4">Address Visualizer</h3>
                <button
                  onClick={() => setViewMode(prev => prev === '2D' ? '3D' : '2D')}
                  className={`
                      px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300
                      ${viewMode === '3D'
                      ? 'bg-accent text-accent-text-contrast shadow-lg shadow-accent/25'
                      : 'bg-card text-muted hover:text-primary hover:bg-element'}
                    `}
                >
                  {viewMode === '2D' ? 'Enter Spatial Mode' : 'Back to 2D View'}
                </button>
              </div>

              {viewMode === '2D' ? (
                <BitExplorer ipv6={parsedAddress} cidr={cidr} />
              ) : (
                <ThreeBitExplorer ipv6={parsedAddress} cidr={cidr} />
              )}
              <EUI64Visualizer />

            </section>
          ) : (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-element rounded-3xl text-muted">
              {error ? 'Invalid Address Configuration' : 'Enter an IPv6 address to begin'}
            </div>
          )}
        </div>
      </div>
      <BottomContent faq={bottomData.faq} sources={bottomData.sources} />
    </Layout >
  );
}

export default App;
