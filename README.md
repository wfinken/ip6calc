# IPv6 Calculator

A modern, feature-rich IPv6 network calculator built with React and Vite. Designed to help network engineers, students, and developers understand and work with IPv6 addressing.

## Features

### Core Functionality
- **Address Parsing & Validation** - Parse and validate IPv6 addresses with full support for compressed notation
- **Address Details** - View canonical, expanded, and compressed forms of any IPv6 address
- **Network Range Calculation** - Calculate network and broadcast addresses, host count using 128-bit precision (BigInt)
- **Address Type Classification** - Identify Global Unicast, Link-Local, Loopback, Multicast, and other address types

### Visualization Tools
- **2D Bit Explorer** - Interactive visualization of all 128 bits with network/host highlighting

- **Subnet Tree** - Visual hierarchy of subnet divisions and relationships
- **EUI-64 Visualizer** - Understand MAC-to-IPv6 interface identifier conversion

### Workflow Tools
- **Config Generator** - Generate router configuration snippets for Cisco, Juniper, and other platforms
- **Bulk Generator** - Generate multiple addresses or subnets at once with export functionality
- **Transition Tools** - 6to4, Teredo, and other IPv4/IPv6 transition mechanism tools

### User Experience
- **Simple Mode** - Beginner-friendly explanations with analogies and metaphors for non-technical users
- **Theme Support** - Light, Dark, and Hacker themes
- **Clipboard Integration** - One-click copy for all address formats

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling

- **Vitest** - Unit testing
- **Cloudflare Workers** - Deployment platform

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Deployment

The project is configured for Cloudflare Workers deployment using Wrangler:

```bash
npm run build
npx wrangler deploy
```

## Project Structure

```
src/
├── components/
│   ├── AddressDetails.jsx    # Address format display
│   ├── BitExplorer.jsx       # 2D bit visualization

│   ├── SubnetTree.jsx        # Subnet hierarchy tree
│   ├── EUI64Visualizer.jsx   # EUI-64 conversion display
│   ├── ConfigGenerator.jsx   # Router config generator
│   ├── BulkGenerator.jsx     # Bulk address generation
│   ├── TransitionTools.jsx   # IPv4/IPv6 transition tools
│   └── ...
├── utils/
│   └── ipv6.js               # Core IPv6 parsing/calculation logic
├── data/
│   └── simpleModeContent.json # Beginner-friendly explanations
└── App.jsx                   # Main application
```

## License

MIT
