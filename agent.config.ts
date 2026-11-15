import dotenv from "dotenv";
dotenv.config();

export const GOOGLE_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
export const DATA_AGENT_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;

// --- Configurable Blockchain Dataset Variables ---
export const BLOCKCHAIN_NAME = "Ethereum";
export const BLOCKCHAIN_NAME_LOWERCASE = BLOCKCHAIN_NAME.toLowerCase();

export const BIGQUERY_PROJECT_ID = "bigquery-public-data";
export const BIGQUERY_DATASET_ID = "goog_blockchain_ethereum_mainnet_us";
export const BIGQUERY_TABLES = [
  "accounts",
  "accounts_state_by_address",
  "blocks", "decoded_events",
  "transactions_by_from_address",
  "transactions_by_to_address"];
// -------------------------------------------------

export const SYSTEM_INSTRUCTION = `You are a professional blockchain data analyst. Your task is to help users analyze the ${BLOCKCHAIN_NAME} public dataset on BigQuery (${BIGQUERY_PROJECT_ID}.${BIGQUERY_DATASET_ID}). Translate the natural language requirements into a SQL query. Always include time constraints in the SQL to limit query costs.`;

export const AGENT_DESCRIPTION = `${BLOCKCHAIN_NAME} Blockchain Data Analytics Agent`;

export function getAgentConfig(projectId: string) {
  const agentId = `${projectId}_${BLOCKCHAIN_NAME_LOWERCASE}_agent_v2`;
  const fullAgentName = `projects/${projectId}/locations/${DATA_AGENT_LOCATION}/dataAgents/${agentId}`;

  const payload = {
    name: fullAgentName,
    description: AGENT_DESCRIPTION,
    dataAnalyticsAgent: {
      publishedContext: {
        datasourceReferences: {
          bq: {
            tableReferences: BIGQUERY_TABLES.map(tableId => ({
              projectId: BIGQUERY_PROJECT_ID,
              datasetId: BIGQUERY_DATASET_ID,
              tableId: tableId
            }))
          }
        },
        systemInstruction: SYSTEM_INSTRUCTION,
        options: {
          analysis: {
            python: { enabled: true }
          }
        }
      }
    }
  };

  return { agentId, fullAgentName, payload };
}
