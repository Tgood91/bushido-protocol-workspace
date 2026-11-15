# Bushido protocol workspace

One place for the Bushido protocol: a trading-terminal app with an AI analytics agent, the system overview, and every
public Bushido repository linked in under [`repos/`](repos).

> **Status.** This README was written from the repository's own files (`metadata.json`, `package.json`,
> `agent.config.ts`) on 2026-11-15. The app was **not built or run** while writing it, and one file has a syntax
> error (see [Known problems](#known-problems)).

## What the app is

From `metadata.json`:

- **Name:** Remix Ethereum AI Analytics Agent
- **Description:** a professional DEX trading terminal and aggregation shell featuring 1inch v5, Li.Fi, Relay, 0xSplits,
  Aerodrome and Velodrome routing, with integrated Ethereum AI analytics.
- **Capability:** server-side Gemini API.

In practice that is three parts:

| Part | Where | What it does |
|---|---|---|
| Front end | `src/` (React 19, Vite 6, Tailwind 4, Recharts and Vega charts) | The trading terminal and the chat with the analytics agent |
| Server | `server.ts`, `server/dexIntelligence.ts` (Express) | Serves the app and the DEX intelligence endpoints |
| Analytics agent | `agent.config.ts` | A Google Cloud data agent that turns plain-language questions into SQL over the public BigQuery Ethereum dataset (`bigquery-public-data.goog_blockchain_ethereum_mainnet_us`) |

## Run it

```bash
npm install
cp .env.example .env      # then fill in GOOGLE_CLOUD_PROJECT_ID and GOOGLE_CLOUD_LOCATION
npm run dev               # the server, with the front end
npm run build && npm start
npm run lint              # type check only
```

Keys and project ids go in `.env`, which is not committed. Never put them in the repository or in chat.

## The system this belongs to

[docs/FLYWHEEL.md](docs/FLYWHEEL.md) is the overview of the Bushido ve(3,3) flywheel: traders and guardrails, the
VirtueFeeRouter fee splitter, gauges and voters, pools and LPs, and the fee receivers. It also says which parts exist
today and which are planned. **BVS** is the Bushido Virtue Score, which scales voting weight in that design.

## The Bushido repositories

Each repository below is linked into this workspace as a git submodule under `repos/`. A submodule is a pointer to
another repository at one exact commit: the code and its history stay in their own repository, and nothing is copied
or changed there.

| Repository | What it is (from its own description) | Pinned at |
|---|---|---|
| [`Monad-OPSTACK-DEX`](https://github.com/Tgood91/Monad-OPSTACK-DEX) | The live Bushido-dApp: swap aggregator and cross-chain bridge, Monad-first, with the Dojo game layer | `517f6d6` |
| [`bushido-virtuals`](https://github.com/Tgood91/bushido-virtuals) | Agent job handlers (Seykota, Druckenmiller) and the swap orchestrator with its safety policy | `2b82e76` |
| [`Bushido-future`](https://github.com/Tgood91/Bushido-future) | Future infrastructure | `2459bc6` |
| [`bushido-labs`](https://github.com/Tgood91/bushido-labs) | Bushido virtues in a decentralized-exchange front end for Base, deployed with Vercel | `01a4e11` |
| [`bushido-dex`](https://github.com/Tgood91/bushido-dex) | DEX dashboard for Base: Rabby wallet, router aggregation (1inch, LI.FI, 0x) and the Bushido Virtue Score (BVS) | `60a5cff` |
| [`bushido-virtuals0`](https://github.com/Tgood91/bushido-virtuals0) | An earlier copy of the agent work, with Vercel | `caede9b` |
| [`bushido-trades1`](https://github.com/Tgood91/bushido-trades1) | "Knowledge is key" | `3968e1e` |
| [`bushido-twpot-1Drip`](https://github.com/Tgood91/bushido-twpot-1Drip) | "toby forge!" | `df1a886` |
| [`just-some-bushido-.sol`](https://github.com/Tgood91/just-some-bushido-.sol) | Solidity contracts and toad lore | `e8dcf72` |
| [`bushidodapp`](https://github.com/Tgood91/bushidodapp) | An early dApp scaffold for Base | `52d5a29` |
| [`adk-samples-bushido-0.1`](https://github.com/Tgood91/adk-samples-bushido-0.1) | A fork of Google's ADK agent samples | `171d537` |

To fetch them all after cloning:

```bash
git submodule update --init            # everything
git submodule update --init repos/bushido-virtuals   # or just one
git submodule update --remote          # move the pins to each repository's newest commit
```

**Not linked:** private repositories are left out, because naming them here would expose them in a public repository.
Repositories without "Bushido" in the name (for example the BTG DAO ones) are also left out, except
`Monad-OPSTACK-DEX`, which is the Bushido-dApp itself.

## Known problems

- `agent.config.ts` does not parse: `AGENT_DESCRIPTION` contains `${Base Mainnet pm] 9p}`, which is not valid
  code. It is left as found.
- `package.json` still carries the template name `react-example`, and the GitHub description reads "TW1.01".
- Several linked repositories overlap (`bushido-virtuals` and `bushido-virtuals0`; three dApp front ends). They are
  linked, not merged: nobody has decided which copy of each is the one to keep.
- `metadata.json` says "1inch v5". In `bushido-virtuals` the 1inch router on Base was verified as AggregationRouterV6;
  this repository's own routing code has not been checked.
