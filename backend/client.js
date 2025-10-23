const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    node: 'http://elasticsearch:9200'
  })

  const pingElasticsearch = async (retries = 5) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        await client.ping();
        console.log("You are connected to Elasticsearch!");
        await createLogsIndexIfNotExists();
        return; 
      } catch (error) {
        console.error(`Elasticsearch connection attempt ${attempt + 1} failed:`, error);
        attempt++;
        if (attempt < retries) {
          console.log('Retrying...');
          await new Promise(resolve => setTimeout(resolve, 9000)); // Wait 5 seconds before retrying
        } else {
          console.error("Failed to connect to Elasticsearch after multiple attempts.");
        }
      }
    }
  };
  
  async function createLogsIndexIfNotExists() {
    try {
      const { body: exists } = await client.indices.exists({ index: 'logs' });
      if (!exists) {
        await client.indices.create({
          index: 'logs',
          body: {
            mappings: {
              properties: {
                id: { type: "keyword" },
                date: { type: "date", format: "yyyy-MM-dd"},
                relationshipId: { type: "keyword" },
                finished: { type: "boolean" },
                closed: { type: "boolean" },
                tasks: {
                  type: "nested",
                  properties: {
                    subTaskId: { type: "text" },
                    startTime: { type: "date", format: "HH:mm:ss" },
                    endTime: { type: "date", format:  "HH:mm:ss" },
                    done: { type: "boolean" },
                    note: { type: "text" }
                  }
                }
              }
            }
          }
        });
        console.log("Created 'logs' index in Elasticsearch.");
      } else {
        console.log("'logs' index already exists.");
      }
    } catch (error) {
      console.error("Failed to create 'logs' index:", error.message);
    }
  }

  pingElasticsearch();

module.exports = client; 