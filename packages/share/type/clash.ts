type Network = 'tcp' | 'udp'

export interface Connection {
  id: string;
  metadata: Metadata;
  upload: number;
  download: number;
  start: Date;
  chains: string[];
  rule: string;
  rulePayload: string;
}

export interface Metadata {
  network: Network | Uppercase<Network>,
  type: string;
  sourceIP: string;
  destinationIP: string;
  sourcePort: string;
  destinationPort: string;
  host: string;
  dnsMode: string;
  processPath: string;
}

export interface ConnectionsResponse {
  upload: number;
  download: number;
  connections: Connection[]
}
