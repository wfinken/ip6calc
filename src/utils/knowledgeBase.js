export const AddressKnowledgeBase = {
    "Unspecified": {
        title: "Unspecified Address",
        description: "The address 0:0:0:0:0:0:0:0 (::) indicates the absence of an address. It is typically used as a source address by a host during the boot process when it has not yet been assigned an IP address.",
        usage: "Used in DHCPv6 solicitations before an IP is acquired.",
        icon: "❓"
    },
    "Loopback": {
        title: "Loopback Address",
        description: "The address ::1 is used to identify the local machine. It is equivalent to 127.0.0.1 in IPv4.",
        usage: "Used for testing networking software on the local machine without sending packets to the network interface.",
        icon: "🔄"
    },
    "Multicast": {
        title: "Multicast Address",
        description: "Addresses starting with ff00::/8 are used for multicast, which identifies a group of interfaces. A packet sent to a multicast address is delivered to all interfaces in the group.",
        usage: "Used for discovery protocols (e.g., mDNS) and streaming media to multiple recipients.",
        icon: "📢"
    },
    "Link-Local": {
        title: "Link-Local Unicast",
        description: "Addresses starting with fe80::/10 are used for communication between nodes on the same link (network segment). They are auto-configured on all interfaces.",
        usage: "Crucial for Neighbor Discovery Protocol (NDP), DHCPv6, and local network management. Routers do not forward these packets.",
        icon: "🔗"
    },
    "Unique Local": {
        title: "Unique Local Unicast (ULA)",
        description: "Addresses starting with fc00::/7 are intended for local communications within a site or between a limited number of sites.",
        usage: "Similar to Private IPv4 addresses (10.x.x.x, 192.168.x.x). Not routable on the global Internet, but safe for internal networks.",
        icon: "🏢"
    },
    "Global Unicast": {
        title: "Global Unicast Address (GUA)",
        description: "Addresses starting with 2000::/3 are globally unique and routable on the public Internet.",
        usage: "Standard public IPv6 addresses assigned to servers and end-users for internet connectivity.",
        icon: "🌐"
    },
    "Unknown/Reserved": {
        title: "Reserved or Unknown",
        description: "This address block is not standard or is reserved for future use by IETF.",
        usage: "Verify if the address is typed correctly.",
        icon: "⚠️"
    }
};

export const getContext = (type) => {
    return AddressKnowledgeBase[type] || AddressKnowledgeBase["Unknown/Reserved"];
};
