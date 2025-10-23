const elasticClient = require('../client');
const db = require('../db');


/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Create a new log entry
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - date
 *               - relationshipId
 *               - finished
 *               - closed
 *               - tasks
 *             properties:
 *               id:
 *                 type: string              
 *               date:
 *                 type: string
 *                 format: date                
 *               relationshipId:
 *                 type: string               
 *               finished:
 *                 type: boolean               
 *               closed:
 *                 type: boolean               
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - subTaskId
 *                     - startTime
 *                     - endTime
 *                     - done
 *                   properties:
 *                     subTaskId:
 *                       type: string                     
 *                     startTime:
 *                       type: string                  
 *                     endTime:
 *                       type: string                    
 *                     done:
 *                       type: boolean                    
 *                     note:
 *                       type: string
 *                     
 *     responses:
 *       201:
 *         description: Log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       500:
 *         description: Error creating log
 */


const createLog = async (req, res) => {
  const logData = req.body;

  try {

    const result = await elasticClient.index({
      index: 'logs',
      body: logData,
    });

    const id = result._id;


    await elasticClient.update({
      index: 'logs',
      id: id,
      body: {
        doc: { id },  
      },
    });

    res.status(201).json({
      message: 'Log created',
      id: id,
    });
  } catch (error) {
    console.error('Hiba:', error);
    res.status(500).json({
      error: 'Hiba',
      message: error.message,
    });
  }
};


/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get all logs 
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   relationshipId:
 *                     type: string
 *                   finished:
 *                     type: boolean
 *                   closed:
 *                     type: boolean
 *                   tasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         subTaskId:
 *                           type: string
 *                         startTime:
 *                           type: string
 *                         endTime:
 *                           type: string
 *                         done:
 *                           type: boolean
 *                         note:
 *                           type: string
 *       500:
 *         description: Error fetching logs
 */


  const getLogs = async (req, res) => {
    try {
        const result = await elasticClient.search({
            index: 'logs',
            query: {
                match_all: {}
            },
            size: 1000
        });

        const logs = result.hits.hits.map(hit => ({
          id: hit._source.id,
          ...hit._source
        }));

        res.status(200).json(logs);
    } catch (error) {
        console.error("Hiba:", error);
        res.status(500).json({ error: 'Hiba', message: error.message });
    }
};

/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Get a specific log by ID
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 relationshipId:
 *                   type: string
 *                 finished:
 *                   type: boolean
 *                 closed:
 *                   type: boolean
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subTaskId:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       done:
 *                         type: boolean
 *                       note:
 *                         type: string
 *       404:
 *         description: Log not found
 *       500:
 *         description: Error fetching log
 */


const getLogById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await elasticClient.search({
            index: 'logs',
            body: {
              query: {
                term: {
                  "id": id
                }
              }
            }
        });

        const logs = result.hits?.hits[0]?._source || null;

        if (!logs) {
          return res.status(404).json({ error: 'Nincs ilyen tevékenységnapló' });
      }

        res.status(200).json(logs); 
    } catch (error) {
      console.error("Hiba az Elasticsearch lekérdezésnél:", JSON.stringify(error, null, 2));
      res.status(500).json({ error: 'Hiba', message: error.message });
    }
};

/**
 * @swagger
 * /logs/{id}:
 *   put:
 *     summary: Update a log entry by ID
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               relationshipId:
 *                 type: string
 *               finished:
 *                 type: boolean
 *               closed:
 *                 type: boolean
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subTaskId:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     done:
 *                       type: boolean
 *                     note:
 *                       type: string
 *     responses:
 *       200:
 *         description: Log updated
 *       404:
 *         description: Log not found
 *       500:
 *         description: Error updating log
 */

const updateLogById = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        const searchResult = await elasticClient.search({
            index: 'logs',
            body: {
              query: {
                term: {
                  "id": id
                }
              }
            }
        });

        const log = searchResult.hits?.hits[0];
        if (!log) {
            return res.status(404).json({ error: 'Nincs ilyen tevékenységnapló' });
        }

        const { _id } = log;

        const updateResult = await elasticClient.update({
            index: 'logs',
            id: _id,
            doc: updatedFields
        });

        res.status(200).send( 'Tevékenységnapló frissítve');
    } catch (error) {
        console.error("Hiba:", error);
        res.status(500).json({ error: 'Hiba', message: error.message });
    }
};

/**
 * @swagger
 * /logs/open:
 *   get:
 *     summary: Get all logs that are not closed
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: List of open logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   relationshipId:
 *                     type: string
 *                   finished:
 *                     type: boolean
 *                   closed:
 *                     type: boolean
 *                   tasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         subTaskId:
 *                           type: string
 *                         startTime:
 *                           type: string
 *                           format: time
 *                         endTime:
 *                           type: string
 *                           format: time
 *                         done:
 *                           type: boolean
 *                         note:
 *                           type: string
 *       500:
 *         description: Error fetching open logs
 */

const getOpenLogs = async (req, res) => {
    try {
      const result = await elasticClient.search({
        index: 'logs',
        body: {
          query: {
            term: {
              closed: false
            }
          }
        }
      });
  
      const logs = result.hits.hits.map(hit => ({
        id: hit._source.id,
        ...hit._source
      }));
  
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching open logs:', error);
      res.status(500).json({ error: 'Error fetching open logs', details: error.message });
    }
  };
  
/**
 * @swagger
 * /logs/{id}:
 *   delete:
 *     summary: Delete a log by ID
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log deleted
 *       404:
 *         description: Log not found
 *       500:
 *         description: Error deleting log
 */

  const deleteLogById = async (req, res) => {
    const { id } = req.params;

    try {
        const searchResult = await elasticClient.search({
            index: 'logs',
            query: {
                term: {
                    id: id
                }
            }
        });

        const log = searchResult.hits?.hits[0];
        if (!log) {
            return res.status(404).json({ error: 'Nincs ilyen tevékenységnapló' });
        }

        const { _id } = log;

        const deleteResult = await elasticClient.delete({
            index: 'logs',
            id: _id
        });

        res.status(200).send( 'Tevékenységnapló törölve');
    } catch (error) {
        console.error("Hiba:", error);
        res.status(500).json({ error: 'Hiba', message: error.message });
    }
};

/**
 * @swagger
 * /logs/relationship/{recipientId}/{caregiverId}:
 *   get:
 *     summary: Get logs for a specific recipient-caregiver relationship
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recipient
 *       - in: path
 *         name: caregiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the caregiver
 *     responses:
 *       200:
 *         description: List of logs for the recipient-caregiver relationship
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   relationshipId:
 *                     type: string
 *                   finished:
 *                     type: boolean
 *                   closed:
 *                     type: boolean
 *                   tasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         subTaskId:
 *                           type: string
 *                         startTime:
 *                           type: string
 *                         endTime:
 *                           type: string
 *                         done:
 *                           type: boolean
 *                         note:
 *                           type: string
 *       404:
 *         description: Relationship not found
 *       500:
 *         description: Server error
 */



const getLogsForRecipientCaregiver = async (req, res) => {
  const { recipientId, caregiverId } = req.params;

  try {
    const pgResult = await db.pool.query(
      'SELECT relationship_id FROM recipients_caregivers WHERE recipient_id = $1 AND caregiver_id = $2',
      [recipientId, caregiverId]
    );

    if (pgResult.rowCount === 0) {
      return res.status(404).json({ message: 'Relationship not found' });
    }

    const relationshipId = pgResult.rows[0].relationship_id;



    const result = await elasticClient.search({
      index: 'logs',
      body: {
        query: {
          term: {
            relationshipId: relationshipId,
          }
        }
      }
    });

    const logs = result.hits.hits.map(hit => ({
      id: hit._source.id,
      ...hit._source
    }));

    return res.json(logs);
  } catch (error) {
    console.error('Error fetching logs for recipient/caregiver:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




module.exports = { createLog,
    getLogs,
    getLogById,
    updateLogById,
    deleteLogById,
    getOpenLogs,
    getLogsForRecipientCaregiver
 };
