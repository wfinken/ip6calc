export class IPv6Address {
    constructor(address) {
        this.original = address;
        this.bigInt = IPv6Address.parse(address);
    }

    static isValid(address) {
        try {
            this.parse(address);
            return true;
        } catch {
            return false;
        }
    }

    // Parse IPv6 string to BigInt
    static parse(address) {
        if (!address) throw new Error("Empty address");

        // Check for invalid chars
        if (/[^0-9a-fA-F:]/.test(address)) throw new Error("Invalid characters");

        // Handle double colon expansion
        const parts = address.split("::");
        if (parts.length > 2) throw new Error("Multiple '::' found");

        let hexParts = [];

        if (parts.length === 2) {
            const left = parts[0] ? parts[0].split(":") : [];
            const right = parts[1] ? parts[1].split(":") : [];
            // Handle edge case where "::" is at start or end, split might give empty string, filter it?
            // "::1" -> "", "1". left=[""], right=["1"]? No. "::".split("::") -> ["", ""]
            // Address.split(":") checks

            const filteredLeft = left.filter(p => p !== "");
            const filteredRight = right.filter(p => p !== "");

            const missing = 8 - (filteredLeft.length + filteredRight.length);

            if (missing < 0) throw new Error("Too many segments");

            hexParts = [...filteredLeft, ...Array(missing).fill("0"), ...filteredRight];
        } else {
            hexParts = address.split(":");
        }

        if (hexParts.length !== 8) throw new Error("Incorrect number of segments");

        let value = 0n;
        for (const part of hexParts) {
            if (part.length > 4) throw new Error("Segment too long");
            const num = part === "" ? 0 : parseInt(part, 16);
            if (isNaN(num)) throw new Error("Invalid hex");
            if (num < 0 || num > 0xffff) throw new Error("Segment out of range");

            value = (value << 16n) + BigInt(num);
        }

        return value;
    }

    static fromBigInt(bigInt) {
        const segments = [];
        for (let i = 7n; i >= 0n; i--) {
            const shift = i * 16n;
            const segment = (bigInt >> shift) & 0xffffn;
            segments.push(segment.toString(16));
        }
        return new IPv6Address(segments.join(":"));
    }

    get expanded() {
        let hex = this.bigInt.toString(16).padStart(32, "0");
        const chunks = [];
        for (let i = 0; i < 32; i += 4) {
            chunks.push(hex.slice(i, i + 4));
        }
        return chunks.join(":");
    }

    get canonical() {
        const segments = [];
        let temp = this.bigInt;
        for (let i = 7n; i >= 0n; i--) {
            const shift = i * 16n;
            const segment = (temp >> shift) & 0xffffn;
            segments.push(Number(segment));
        }

        let maxLen = 0;
        let maxStart = -1;
        let currentLen = 0;
        let currentStart = -1;

        for (let i = 0; i < 8; i++) {
            if (segments[i] === 0) {
                if (currentLen === 0) currentStart = i;
                currentLen++;
            } else {
                if (currentLen > maxLen) {
                    maxLen = currentLen;
                    maxStart = currentStart;
                }
                currentLen = 0;
            }
        }
        if (currentLen > maxLen) {
            maxLen = currentLen;
            maxStart = currentStart;
        }

        let result = segments.map(s => s.toString(16));

        if (maxLen > 1) {
            const pre = result.slice(0, maxStart);
            const post = result.slice(maxStart + maxLen);

            let preStr = pre.join(":");
            let postStr = post.join(":");

            return `${preStr}::${postStr}`;
        }

        return result.join(":");
    }

    get type() {
        const val = this.bigInt;

        if (val === 0n) return "Unspecified";
        if (val === 1n) return "Loopback";

        const high8 = val >> 120n;
        if (high8 === 0xffn) return "Multicast";

        const high10 = val >> 118n;
        if (high10 === 0x3fan) return "Link-Local";

        // Unique Local: fc00::/7 (1111 110x) -> High 7 bits are 1111 110 (0x7e? No. 0xfc is 1111 1100. )
        // fc = 1111 1100. fd = 1111 1101. Both start with 1111 110.
        const high7 = val >> 121n;
        if (high7 === 0x7en) return "Unique Local"; // 1111 110 is 0x7e. Correct.

        const high3 = val >> 125n;
        if (high3 === 0x01n) return "Global Unicast"; // 001

        return "Unknown/Reserved";
    }

    get binary() {
        return this.bigInt.toString(2).padStart(128, '0');
    }

    get reverseDNS() {
        const hex = this.bigInt.toString(16).padStart(32, '0');
        return hex.split('').reverse().join('.') + '.ip6.arpa';
    }

    // --- Transition Helpers ---

    static ipv4ToHex(ipv4) {
        if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ipv4)) throw new Error("Invalid IPv4 address");
        const parts = ipv4.split('.').map(Number);
        if (parts.some(p => p < 0 || p > 255)) throw new Error("Invalid IPv4 segment");
        return parts.map(p => p.toString(16).padStart(2, '0')).join('');
    }

    static createNAT64(ipv4) {
        const hex = this.ipv4ToHex(ipv4);
        // Well-Known Prefix 64:ff9b::/96
        const addr = `64:ff9b::${hex.slice(0, 4)}:${hex.slice(4)}`;
        return new IPv6Address(addr);
    }

    static create6to4(ipv4) {
        const hex = this.ipv4ToHex(ipv4);
        // 2002:aabb:ccdd::
        const addr = `2002:${hex.slice(0, 4)}:${hex.slice(4)}::`;
        return new IPv6Address(addr);
    }

    static createISATAP(ipv4, prefix = "fe80::") {
        const hex = this.ipv4ToHex(ipv4);
        // ISATAP IID: ::0000:5efe:V.4.A.D (where V4AD is hex IP)
        // Modified EUI-64 format for ISATAP looks like 0000:5EFE:IP:V4
        // Usually appended to a /64 prefix.
        // If prefix is just "fe80::", we want "fe80::5efe:aabb:ccdd" (compressed)
        // or expanding the prefix if it's already complex.

        // We'll assume prefix is a clean base like "2001:db8::" or "fe80::"
        // remove trailing "::" or ":" to append
        let cleanPrefix = prefix.replace(/:+$/, '');
        if (!cleanPrefix) cleanPrefix = "fe80";

        const addr = `${cleanPrefix}::5efe:${hex.slice(0, 4)}:${hex.slice(4)}`;
        return new IPv6Address(addr);
    }
}

export class IPv6Subnet {
    constructor(addressString, cidr) {
        this.address = new IPv6Address(addressString);
        this.cidr = BigInt(cidr);
        if (this.cidr < 0n || this.cidr > 128n) throw new Error("Invalid CIDR");
    }

    get startAddress() {
        const mask = this.getMask();
        const networkVal = this.address.bigInt & mask;
        return IPv6Address.fromBigInt(networkVal);
    }

    get endAddress() {
        const hostBits = 128n - this.cidr;
        const wildCard = (1n << hostBits) - 1n;
        const mask = this.getMask();
        const networkVal = this.address.bigInt & mask;
        return IPv6Address.fromBigInt(networkVal | wildCard);
    }

    get hostsCount() {
        if (this.cidr === 128n) return 1n;
        const hostBits = 128n - this.cidr;
        return 1n << hostBits;
    }

    getMask() {
        if (this.cidr === 0n) return 0n;
        const shift = 128n - this.cidr;
        return ((1n << 128n) - 1n) >> shift << shift;
    }
}
