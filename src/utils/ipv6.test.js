import { describe, it, expect } from 'vitest';
import { IPv6Address, IPv6Subnet } from './ipv6';

describe('IPv6Address', () => {
    describe('Parsing & Validation', () => {
        it('parses localhost', () => {
            const addr = new IPv6Address('::1');
            expect(addr.bigInt).toBe(1n);
        });

        it('parses unspecified', () => {
            const addr = new IPv6Address('::');
            expect(addr.bigInt).toBe(0n);
        });

        it('parses full address', () => {
            const addr = new IPv6Address('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
            const expected = BigInt('0x20010db885a3000000008a2e03707334');
            expect(addr.bigInt).toBe(expected);
        });

        it('parses compressed address', () => {
            const addr = new IPv6Address('2001:db8::1');
            // 2001 0db8 0000 0000 0000 0000 0000 0001
            const expected = BigInt('0x20010db8000000000000000000000001');
            expect(addr.bigInt).toBe(expected);
        });

        it('rejects invalid chars', () => {
            expect(() => new IPv6Address('g:1::')).toThrow();
        });

        it('rejects too many segments', () => {
            expect(() => new IPv6Address('1:2:3:4:5:6:7:8:9')).toThrow();
        });

        it('rejects multiple double colons', () => {
            expect(() => new IPv6Address('1::2::3')).toThrow();
        });
    });

    describe('Formatting', () => {
        it('expands correctly', () => {
            const addr = new IPv6Address('::1');
            expect(addr.expanded).toBe('0000:0000:0000:0000:0000:0000:0000:0001');
        });

        it('canonicalizes correctly', () => {
            const addr = new IPv6Address('0000:0000:0000:0000:0000:0000:0000:0001');
            expect(addr.canonical).toBe('::1');
        });

        it('canonicalizes complex case', () => {
            const addr = new IPv6Address('2001:0db8:0000:0000:0001:0000:0000:0001');
            // Should compress longest zero sequence. Equal length? First one.
            // 2001:db8::1:0:0:1
            expect(addr.canonical).toBe('2001:db8::1:0:0:1');
        });

        it('mixed case input canonicalizes to lower', () => {
            const addr = new IPv6Address('2001:DB8::');
            expect(addr.canonical).toBe('2001:db8::');
        });
    });

    describe('Type Classification', () => {
        it('identifies loopback', () => {
            expect(new IPv6Address('::1').type).toBe('Loopback');
        });

        it('identifies unspecified', () => {
            expect(new IPv6Address('::').type).toBe('Unspecified');
        });

        it('identifies multicast', () => {
            expect(new IPv6Address('ff02::1').type).toBe('Multicast');
        });

        it('identifies link-local', () => {
            expect(new IPv6Address('fe80::1').type).toBe('Link-Local');
        });

        it('identifies global unicast', () => {
            expect(new IPv6Address('2001:db8::').type).toBe('Global Unicast');
        });

        it('identifies unique local', () => {
            expect(new IPv6Address('fd00::1').type).toBe('Unique Local');
        });
    });
});

describe('IPv6Subnet', () => {
    it('calculates /64 range', () => {
        const subnet = new IPv6Subnet('2001:db8::1', 64);
        expect(subnet.startAddress.canonical).toBe('2001:db8::');
        expect(subnet.endAddress.canonical).toBe('2001:db8::ffff:ffff:ffff:ffff');
    });

    it('calculates /128 range', () => {
        const subnet = new IPv6Subnet('::1', 128);
        expect(subnet.startAddress.canonical).toBe('::1');
        expect(subnet.endAddress.canonical).toBe('::1');
        expect(subnet.hostsCount).toBe(1n);
    });

    it('calculates /0 range', () => {
        const subnet = new IPv6Subnet('::', 0);
        expect(subnet.startAddress.canonical).toBe('::');
        expect(subnet.endAddress.expanded).toBe('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff'); // canonical would be same? No, canonical suppresses zeros, but all f isn't 0.
        expect(subnet.hostsCount).toBe(1n << 128n);
    });
});

describe('Advanced Networking Utilities', () => {
    it('generates reverse DNS', () => {
        const addr = new IPv6Address('2001:db8::1');
        const expected = '1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa';
        expect(addr.reverseDNS).toBe(expected);
    });

    it('converts IPv4 to Hex helper', () => {
        expect(IPv6Address.ipv4ToHex('192.168.0.1')).toBe('c0a80001');
        expect(IPv6Address.ipv4ToHex('10.0.0.0')).toBe('0a000000');
    });

    it('creates NAT64 address', () => {
        const addr = IPv6Address.createNAT64('192.0.2.1');
        expect(addr.canonical).toBe('64:ff9b::c000:201');
    });

    it('creates 6to4 address', () => {
        const addr = IPv6Address.create6to4('192.0.2.1');
        expect(addr.canonical).toBe('2002:c000:201::');
    });

    it('creates ISATAP address with default prefix', () => {
        const addr = IPv6Address.createISATAP('192.0.2.1');
        expect(addr.canonical).toBe('fe80::5efe:c000:201');
    });

    it('creates ISATAP address with custom prefix', () => {
        const addr = IPv6Address.createISATAP('192.0.2.1', '2001:db8::');
        expect(addr.canonical).toBe('2001:db8::5efe:c000:201');
    });
});
