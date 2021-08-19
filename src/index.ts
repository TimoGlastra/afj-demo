import {
  Agent,
  HttpOutboundTransporter,
  InitConfig,
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";

import { BCOVRIN_TEST_GENESIS } from "./util";

const aliceConig: InitConfig = {
  label: "Alice",
  walletConfig: {
    id: "Alice",
    key: "Alice",
  },
  genesisTransactions: BCOVRIN_TEST_GENESIS,
  endpoint: "http://localhost:3000",
  autoAcceptConnections: true,
};

const bobConfig: InitConfig = {
  label: "Bob",
  walletConfig: {
    id: "Bob",
    key: "Bob",
  },
  genesisTransactions: BCOVRIN_TEST_GENESIS,
  endpoint: "http://localhost:3001",
  autoAcceptConnections: true,
};

const aliceAgent = new Agent(aliceConig, agentDependencies);
aliceAgent.setInboundTransporter(
  new HttpInboundTransport({
    port: 3000,
  })
);
aliceAgent.setOutboundTransporter(new HttpOutboundTransporter());

const bobAgent = new Agent(bobConfig, agentDependencies);
bobAgent.setInboundTransporter(
  new HttpInboundTransport({
    port: 3001,
  })
);
bobAgent.setOutboundTransporter(new HttpOutboundTransporter());

async function run() {
  await aliceAgent.initialize();
  await bobAgent.initialize();

  const { invitation } = await aliceAgent.connections.createConnection();
  const bobAliceConnection = await bobAgent.connections.receiveInvitation(
    invitation
  );

  console.log("Done");
}

run();
