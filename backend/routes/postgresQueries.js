const db = require('../db');
const bcrypt = require('bcrypt');



/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Invalid or no token
 *       403:
 *         description: Not authorized
 */


const getAdmins = (req, res) => {
    db.pool.query("SELECT id, name, email FROM admins ORDER BY id ASC", (err, result) => {
        if(err){
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));

        res.status(200).json(rows);

    });
}


/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server error
 *       401:
 *         description: Invalid or no token
 *       403:
 *         description: Not authorized
 */

const createAdmin = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.pool.query("INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *;", [name, email, hashedPassword], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba az admin felhasználó létrehozásakor', message: err.message });
        }


    const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(201).json(rows[0]);
    });
}


/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 *       401:
 *         description: Invalid or no token
 *       403:
 *         description: Not authorized
 */

const getAdminById = (req, res) => {
    const id = req.params.id;

    db.pool.query("SELECT id, name, email FROM admins WHERE id = $1;", [id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen admin' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));

        res.status(200).json(rows[0]);
    });
}



/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Update an admin's info
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated
 *       400:
 *         description: Missing required field
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 *       401:
 *         description: Invalid or no token
 *       403:
 *         description: Not authorized
 */

const updateAdmin = (req, res) => {
    const id = req.params.id;
    const {name, email} = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query("UPDATE admins SET name = $1, email = $2 WHERE id =$3 RETURNING id,name,email;", [name, email, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen admin' });
        }

        res.status(200).send('Admin frissítve');
    });

}


/**
 * @swagger
 * /admins/{id}/password:
 *   put:
 *     summary: Update an admins's password
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid current password or missing field
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 *       401:
 *         description: Invalid or no token
 *       403:
 *         description: Not authorized
 */

const updateAdminPassword = async (req, res) => {
    const id = req.params.id;
    const {currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const result = await db.pool.query("SELECT password FROM admins WHERE id = $1;", [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Nincs ilyen admin' });
    }

    const storedPasswordHash = result.rows[0].password;

    const isPasswordValid = await bcrypt.compare(currentPassword, storedPasswordHash);

    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Helytelen régi jelszó' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    db.pool.query("UPDATE admins SET password = $1 WHERE id = $2 RETURNING id, name, email;", [hashedNewPassword, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }


        res.status(200).send('Sikeres jelszó változtatás');
    });

}


/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 *       401:
 *         description: Invalid or no token
 *       403:
 *         description: Not authorized
 */

const deleteAdmin = (req, res) => {
    const id = req.params.id;

    db.pool.query("DELETE FROM admins WHERE id=$1 RETURNING id", [id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen admin' });
        }

        res.status(200).send('Admin törölve');
    });
}


/**
 * @swagger
 * /caregivers:
 *   get:
 *     summary: Get all caregivers
 *     tags: [Caregivers]
 *     responses:
 *       200:
 *         description: A list of caregivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 */

const getCaregivers = (req, res) => {
    db.pool.query("SELECT id, name, phone, email FROM caregivers ORDER BY id ASC", (err, result) => {
        if(err){
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows);

    });
}


/**
 * @swagger
 * /caregivers:
 *   post:
 *     summary: Create a new caregiver
 *     tags: [Caregivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Caregiver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 password:
 *                   type: string
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server error
 */

const createCaregiver = async (req, res) => {
    const {name, email, phone, password} = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.pool.query("INSERT INTO caregivers (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *;", [name, email, phone, hashedPassword], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba a gondozó létrehozásakor', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(201).json(rows[0]);
    });
}


/**
 * @swagger
 * /caregivers/{id}:
 *   get:
 *     summary: Get a caregiver by ID
 *     tags: [Caregivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Caregiver ID
 *     responses:
 *       200:
 *         description: Caregiver data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Caregiver not found
 *       500:
 *         description: Server error
 */

const getCaregiverById = (req, res) => {
    const id = req.params.id;

    db.pool.query("SELECT id, name, phone, email FROM caregivers WHERE id = $1;", [id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen gondozó' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows[0]);
    });
}


/**
 * @swagger
 * /caregivers/{id}:
 *   put:
 *     summary: Update a caregiver's info
 *     tags: [Caregivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Caregiver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caregiver updated
  *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       400:
 *         description: Missing required field
 *       404:
 *         description: Caregiver not found
 *       500:
 *         description: Server error
 */

const updateCaregiver = (req, res) => {
    const id = req.params.id;
    const {name, email, phone} = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query("UPDATE caregivers SET name = $1, email = $2, phone = $3 WHERE id =$4 RETURNING id,name,email,phone;", [name, email, phone, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen gondozó' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows[0]);
    });

}


/**
 * @swagger
 * /caregivers/{id}/password:
 *   put:
 *     summary: Update a caregiver's password
 *     tags: [Caregivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Caregiver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid current password or missing field
 *       404:
 *         description: Caregiver not found
 *       500:
 *         description: Server error
 */

const updateCaregiverPassword = async (req, res) => {
    const id = req.params.id;
    const {currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const result = await db.pool.query("SELECT password FROM caregivers WHERE id = $1;", [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Nincs ilyen gondozó' });
    }

    const storedPasswordHash = result.rows[0].password;

    const isPasswordValid = await bcrypt.compare(currentPassword, storedPasswordHash);

    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Helytelen régi jelszó' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    db.pool.query("UPDATE caregivers SET password = $1 WHERE id = $2 RETURNING id, name, email, phone;", [hashedNewPassword, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }


        res.status(200).send('Sikeres jelszó változtatás' );
    });

}


/**
 * @swagger
 * /caregivers/{id}:
 *   delete:
 *     summary: Delete a caregiver
 *     tags: [Caregivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Caregiver ID
 *     responses:
 *       200:
 *         description: Caregiver deleted
 *       404:
 *         description: Caregiver not found
 *       500:
 *         description: Server error
 */

const deleteCaregiver = (req, res) => {
    const id = req.params.id;

    db.pool.query("DELETE FROM caregivers WHERE id=$1 RETURNING id", [id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen gondozó' });
        }

        res.status(200).send('Gondozó törölve');
    });
}

/**
 * @swagger
 * /recipients:
 *   get:
 *     summary: Get all recipients
 *     tags: [Recipients]
 *     responses:
 *       200:
 *         description: A list of recipients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   four_hand_care_needed:
 *                     type: boolean
 *                   caregiver_note:
 *                     type: string
 */

const getRecipients = (req, res) => {
    db.pool.query("SELECT id, name, email, phone, address, four_hand_care_needed, caregiver_note FROM recipients ORDER BY id ASC", (err, result) => {
        if(err){
            console.error("Hiba:", error);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows);

    });
}

/**
 * @swagger
 * /recipients:
 *   post:
 *     summary: Create a new recipient
 *     tags: [Recipients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, address, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               four_hand_care_needed:
 *                 type: boolean
 *               caregiver_note:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 four_hand_care_needed:
 *                   type: boolean
 *                 caregiver_note:
 *                   type: string
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server error
 */

const createRecipient = async (req, res) => {
    const {name, email, phone, address, four_hand_care_needed, caregiver_note, password} = req.body;

    if (!name || !email || !phone || !address || !password) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.pool.query("INSERT INTO recipients (name, email, phone, address, four_hand_care_needed, caregiver_note, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING name, email, phone, address, four_hand_care_needed, caregiver_note;", [name, email, phone, address, four_hand_care_needed, caregiver_note, hashedPassword], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba a gondozott létrehozásakor', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(201).send(rows[0]);
    });
}


/**
 * @swagger
 * /recipients/{id}:
 *   get:
 *     summary: Get a recipient by ID
 *     tags: [Recipients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipient ID
 *     responses:
 *       200:
 *         description: Recipient data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 four_hand_care_needed:
 *                   type: boolean
 *                 caregiver_note:
 *                   type: string
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: Server error
 */

const getRecipientById = (req, res) => {
    const id = req.params.id;

    db.pool.query("SELECT id, name, email, phone, address, four_hand_care_needed, caregiver_note FROM recipients WHERE id = $1;", [id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen gondozott' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows[0]);
    });
}

/**
 * @swagger
 * /recipients/{id}:
 *   put:
 *     summary: Update a recipient's info
 *     tags: [Recipients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, address]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               four_hand_care_needed:
 *                 type: boolean
 *               caregiver_note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recipient updated
 *       400:
 *         description: Missing required field
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: Server error
 */

const updateRecipient = (req, res) => {
    const id = req.params.id;
    const {name, email, phone, address, four_hand_care_needed, caregiver_note} = req.body;

    if (!name || !email || !phone || !address) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query("UPDATE recipients SET name = $1, email = $2, phone = $3, address = $4, four_hand_care_needed = $5, caregiver_note = $6 WHERE id = $7 RETURNING id, name, email, phone, address, four_hand_care_needed, caregiver_note;", [name, email, phone, address, four_hand_care_needed, caregiver_note, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen gondozott' });
        }

        res.status(200).send('Gondozott frissítve');
    });

}

/**
 * @swagger
 * /recipients/{id}/password:
 *   put:
 *     summary: Update a recipient's password
 *     tags: [Recipients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid current password or missing field
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: Server error
 */

const updateRecipientPassword = async (req, res) => {
    const id = req.params.id;
    const {currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const result = await db.pool.query("SELECT password FROM recipients WHERE id = $1;", [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Nincs ilyen gondozott' });
    }

    const storedPasswordHash = result.rows[0].password;

    const isPasswordValid = await bcrypt.compare(currentPassword, storedPasswordHash);

    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Helytelen régi jelszó' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    db.pool.query("UPDATE recipients SET password = $1 WHERE id = $2 RETURNING id, name, email, phone;", [hashedNewPassword, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }


        res.status(200).send('Sikeres jelszó változtatás' );
    });

}

/**
 * @swagger
 * /recipients/{id}:
 *   delete:
 *     summary: Delete a recipient
 *     tags: [Recipients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipient ID
 *     responses:
 *       200:
 *         description: Recipient deleted
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: Server error
 */

const deleteRecipient = (req, res) => {
    const id = req.params.id;

    db.pool.query("DELETE FROM recipients WHERE id=$1 RETURNING id", [id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen gondozott' });
        }

        res.status(200).send('Gondozott törölve');
    });
}


/**
 * @swagger
 * /caregivers/recipients:
 *   post:
 *     summary: Assign a recipient to a caregiver
 *     tags: [Relationships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipientId, caregiverId]
 *             properties:
 *               recipientId:
 *                 type: integer
 *               caregiverId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Recipient assigned to caregiver
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 relationship_id:
 *                   type: integer
 *                 recipientId:
 *                   type: integer
 *                 caregiverId:
 *                   type: integer
 *       500:
 *         description: Server error
 */

const addRecipientToCaregiver = (req, res) => {
    const { recipientId, caregiverId } = req.body;

    db.pool.query(
        "INSERT INTO recipients_caregivers (recipient_id, caregiver_id) VALUES ($1, $2) RETURNING *;",
        [recipientId, caregiverId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Hiba a gondozott hozzáadásakor a gondozóhoz', message: err.message });
            }

            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


            res.status(201).json(rows[0]);
        }
    );
};

/**
 * @swagger
 * /recipients/{id}/caregivers:
 *   get:
 *     summary: Get all caregivers assigned to a recipient
 *     tags: [Relationships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipient ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of caregivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   relationship_id:
 *                     type: integer
 *       500:
 *         description: Server error
 */

const getCaregiversForRecipient = (req, res) => {
    const recipientId = req.params.id;

    db.pool.query(
        `SELECT 
            c.id, 
            c.name, 
            c.phone, 
            c.email, 
            cr.relationship_id AS relationship_id
         FROM caregivers c
         JOIN recipients_caregivers cr ON c.id = cr.caregiver_id
         WHERE cr.recipient_id = $1;`,
        [recipientId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Hiba: ', message: err.message });
            }

            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


            res.status(200).json(rows);
        }
    );
};


/**
 * @swagger
 * /caregivers/{id}/recipients:
 *   get:
 *     summary: Get all recipients assigned to a caregiver
 *     tags: [Relationships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Caregiver ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of recipients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   relationship_id:
 *                     type: integer
 *       500:
 *         description: Server error
 */

const getRecipientsForCaregiver = (req, res) => {
    const caregiverId = req.params.id;

    db.pool.query(
        "SELECT r.id, r.name, r.phone, r.email, r.address, rc.relationship_id AS relationship_id FROM recipients r JOIN recipients_caregivers rc ON r.id = rc.recipient_id WHERE rc.caregiver_id = $1;",
        [caregiverId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Hiba: ', message: err.message });
            }


            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));

            res.status(200).json(rows);
        }
    );
};

/**
 * @swagger
 * /relationships/{id}:
 *   delete:
 *     summary: Delete a caregiver-recipient relationship
 *     tags: [Relationships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Relationship ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relationship deleted successfully
 *       404:
 *         description: Relationship not found
 *       500:
 *         description: Server error
 */

const deleteRelationship = (req, res) => {
    const relationshipId = req.params.id;

    db.pool.query(
        "DELETE FROM recipients_caregivers WHERE relationship_id = $1 RETURNING *;",
        [relationshipId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error deleting relationship', message: err.message });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Relationship not found' });
            }

            res.status(200).send( 'Relationship deleted');
        }
    );
};

/**
 * @swagger
 * /relationships/{id}:
 *   put:
 *     summary: Update a caregiver-recipient relationship
 *     tags: [Relationships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Relationship ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - caregiverId
 *             properties:
 *               recipientId:
 *                 type: integer
 *               caregiverId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relationship updated successfully
 *       404:
 *         description: Relationship not found
 *       500:
 *         description: Server error
 */
const updateRelationship = (req, res) => {
    const relationshipId = req.params.id;
    const { recipientId, caregiverId } = req.body;

    db.pool.query(
        "UPDATE recipients_caregivers SET recipient_id = $1, caregiver_id = $2 WHERE relationship_id = $3 RETURNING *;",
        [recipientId, caregiverId, relationshipId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error updating relationship', message: err.message });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Relationship not found' });
            }

            res.status(200).send('Relationship updated');
        }
    );
};

/**
 * @swagger
 * /relationships:
 *   get:
 *     summary: Get all caregiver-recipient relationships
 *     tags: [Relationships]
 *     responses:
 *       200:
 *         description: A list of relationships with caregiver and recipient details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   relationship_id:
 *                     type: integer
 *                   recipient_id:
 *                     type: integer
 *                   recipient_name:
 *                     type: string
 *                   caregiver_id:
 *                     type: integer
 *                   caregiver_name:
 *                     type: string
 *       500:
 *         description: Server error
 */
const getAllRelationships = (req, res) => {
    db.pool.query(
      `SELECT 
        rc.relationship_id,
        rc.recipient_id,
        r.name AS recipient_name,
        rc.caregiver_id,
        c.name AS caregiver_name
      FROM recipients_caregivers rc
      JOIN recipients r ON rc.recipient_id = r.id
      JOIN caregivers c ON rc.caregiver_id = c.id;`,
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));

  
        res.status(200).json(rows);
      }
    );
  };
  


/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relationship_id
 *               - date
 *               - start_time
 *               - end_time
 *             properties:
 *               relationship_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *     responses:
 *       201:
 *         description: Schedule created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 relationship_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date
 *                 start_time:
 *                   type: string
 *                   format: time
 *                 end_time:
 *                   type: string
 *                   format: time
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

const createSchedule = (req, res) => {
    const { relationship_id, date, start_time, end_time } = req.body;

    if (!relationship_id || !date || !start_time || !end_time) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query(
        "INSERT INTO schedules (relationship_id, date, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *;",
        [relationship_id, date, start_time, end_time],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: 'Hiba a beosztás létrehozásakor: ', message: err.message });
            }


            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));

            res.status(201).json(rows[0] );
        }
    );
};

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: List of all schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   relationship_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   start_time:
 *                     type: string
 *                     format: time
 *                   end_time:
 *                     type: string
 *                     format: time
 *       500:
 *         description: Server error
 */


const getSchedules = (req, res) => {
    db.pool.query("SELECT * FROM schedules ORDER BY id ASC;", (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json( rows );
    });
};


/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Schedule ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 relationship_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date
 *                 start_time:
 *                   type: string
 *                   format: time
 *                 end_time:
 *                   type: string
 *                   format: time
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */

const getScheduleById = (req, res) => {
    const id = req.params.id;

    db.pool.query("SELECT * FROM schedules WHERE id = $1;", [id], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen beosztás' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json( rows[0] );
    });
};

/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update a schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Schedule ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relationship_id
 *               - date
 *               - start_time
 *               - end_time
 *             properties:
 *               relationship_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *     responses:
 *       200:
 *         description: Schedule updated
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */

const updateSchedule = (req, res) => {
    const id = req.params.id;
    const { relationship_id, date, start_time, end_time } = req.body;

    if (!relationship_id || !date || !start_time || !end_time) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query(
        "UPDATE schedules SET relationship_id = $1, date = $2, start_time = $3, end_time = $4 WHERE id = $5 RETURNING *;",
        [relationship_id, date, start_time, end_time, id],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: 'Hiba', message: err.message });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Nincs ilyen beosztás' });
            }

            res.status(200).send('Beosztás frissítve');
        }
    );
};

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete a schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Schedule ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule deleted
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */

const deleteSchedule = (req, res) => {
    const id = req.params.id;

    db.pool.query("DELETE FROM schedules WHERE id = $1 RETURNING id;", [id], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen beosztás' });
        }

        res.status(200).send( 'Beosztás törölve' );
    });
};

/**
 * @swagger
 * /schedules/caregiver/{caregiverId}:
 *   get:
 *     summary: Get all schedules for a specific caregiver
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: caregiverId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the caregiver
 *     responses:
 *       200:
 *         description: List of schedules for the caregiver
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   relationship_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   start_time:
 *                     type: string
 *                     format: time
 *                   end_time:
 *                     type: string
 *                     format: time
 *       404:
 *         description: No schedules found for this caregiver
 *       500:
 *         description: Server error
 */

const getSchedulesForCaregiver = (req, res) => {
    const caregiverId = req.params.caregiverId;

    db.pool.query(
        "SELECT * FROM schedules WHERE relationship_id IN (SELECT relationship_id FROM recipients_caregivers WHERE caregiver_id = $1);",
        [caregiverId],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: 'Hiba', message: err.message });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Nincs beosztás ehhez a gondozóhoz' });
            }

            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


            res.status(200).json(rows);
        }
    );
};

/**
 * @swagger
 * /schedules/recipient/{recipientId}:
 *   get:
 *     summary: Get all schedules for a specific recipient
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recipient
 *     responses:
 *       200:
 *         description: List of schedules for the recipient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   relationship_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   start_time:
 *                     type: string
 *                     format: time
 *                   end_time:
 *                     type: string
 *                     format: time
 *       404:
 *         description: No schedules found for this recipient
 *       500:
 *         description: Server error
 */

const getSchedulesForRecipient = (req, res) => {
    const recipientId = req.params.recipientId;

    db.pool.query(
        "SELECT * FROM schedules WHERE relationship_id IN (SELECT relationship_id FROM recipients_caregivers WHERE recipient_id = $1);",
        [recipientId],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: 'Hiba', message: err.message });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Nincs beosztás ehhez a gondozotthoz' });
            }

            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


            res.status(200).json(rows);
        }
    );
};


/**
 * @swagger
 * /schedules/{caregiverId}/{recipientId}:
 *   get:
 *     summary: Get all schedules between a caregiver and a recipient
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: caregiverId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the caregiver
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recipient
 *     responses:
 *       200:
 *         description: List of schedules between the caregiver and recipient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   relationship_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   start_time:
 *                     type: string
 *                     format: time
 *                   end_time:
 *                     type: string
 *                     format: time
 *       404:
 *         description: No schedules found for this caregiver-recipient pair
 *       500:
 *         description: Server error
 */

const getSchedulesForCaregiverAndRecipient = (req, res) => {
    const { caregiverId, recipientId } = req.params;

    const query = `
        SELECT s.*
        FROM schedules s
        JOIN recipients_caregivers rc ON s.relationship_id = rc.relationship_id
        WHERE rc.caregiver_id = $1 AND rc.recipient_id = $2;
    `;

    db.pool.query(query, [caregiverId, recipientId], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ennnek a gondozónak nincs beosztása ehhez a gondozotthoz' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows);
    });
};

/**
 * @swagger
 * /tasktypes:
 *   post:
 *     summary: Create a new task type
 *     tags: [TaskTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task type created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 type:
 *                   type: string
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server error
 */

const createTaskType = (req, res) => {
    const { type } = req.body;

    if (!type) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query(
        "INSERT INTO task_types (type) VALUES ($1) RETURNING *;",
        [type],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: 'Hiba a típus létrehozásakor: ', message: err.message });
            }

            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


            res.status(201).json( rows[0] );
        }
    );
};

/**
 * @swagger
 * /tasktypes:
 *   get:
 *     summary: Get all task types
 *     tags: [TaskTypes]
 *     responses:
 *       200:
 *         description: List of task types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *       500:
 *         description: Server error
 */

const getTaskType = (req, res) => {
    db.pool.query("SELECT * FROM task_types ORDER BY id ASC;", (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json( rows );
    });
};

/**
 * @swagger
 * /tasktypes/{id}:
 *   get:
 *     summary: Get a specific task type by ID
 *     tags: [TaskTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 type:
 *                   type: string
 *       404:
 *         description: Task type not found
 *       500:
 *         description: Server error
 */

const getTaskTypeById = (req, res) => {
    const id = req.params.id;

    db.pool.query("SELECT * FROM task_types WHERE id = $1;", [id], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen típus' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows[0] );
    });
};

/**
 * @swagger
 * /subtasks:
 *   post:
 *     summary: Create a new subtask
 *     tags: [SubTasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, taskTypeId]
 *             properties:
 *               title:
 *                 type: string
 *               taskTypeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subtask created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 tasktypeId:
 *                   type: integer
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

const createSubTask = (req, res) => {
    const { title, taskTypeId } = req.body;

    if (!title || !taskTypeId ) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query(
        "INSERT INTO subTasks (title, taskTypeId) VALUES ($1, $2) RETURNING *;",
        [title, taskTypeId],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: 'Hiba a tevékenység létrehozásakor: ', message: err.message });
            }

            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


            res.status(201).json( rows[0] );
        }
    );
};

/**
 * @swagger
 * /subtasks:
 *   get:
 *     summary: Get all subtasks
 *     tags: [SubTasks]
 *     responses:
 *       200:
 *         description: List of all subtasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   tasktypeId:
 *                     type: integer
 *       500:
 *         description: Server error
 */

const getSubTask = (req, res) => {
    db.pool.query("SELECT * FROM subTasks ORDER BY id ASC;", (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json( rows );
    });
};

/**
 * @swagger
 * /subtasks/{id}:
 *   get:
 *     summary: Get a specific subtask by ID
 *     tags: [SubTasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subtask details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 tasktypeId:
 *                   type: integer
 *       404:
 *         description: Subtask not found
 *       500:
 *         description: Server error
 */

const getSubTaskById = (req, res) => {
    const id = req.params.id;

    db.pool.query("SELECT * FROM subTasks WHERE id = $1;", [id], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen tevékenység' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));

        res.status(200).json( rows[0] );
    });
};

/**
 * @swagger
 * /subtasks/tasktype/{taskTypeId}:
 *   get:
 *     summary: Get all subtasks by task type ID
 *     tags: [SubTasks]
 *     parameters:
 *       - in: path
 *         name: taskTypeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of subtasks for the given task type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   tasktypeId:
 *                     type: integer
 *       404:
 *         description: No subtasks found
 *       500:
 *         description: Server error
 */

const getSubTasksByTaskType = (req, res) => {
    const taskTypeId = req.params.taskTypeId;

    db.pool.query(
        "SELECT * FROM subTasks WHERE taskTypeId = $1;",
        [taskTypeId],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: "Hiba", message: err.message });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Nincs ilyen típusú tevékenység." });
            }

            const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


            res.status(200).json(rows);
        }
    );
};

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of all todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   subtaskId:
 *                     type: integer
 *                   relationshipId:
 *                     type: integer
 *                   sequenceNumber:
 *                     type: integer
 *                   done:
 *                     type: boolean
 *       500:
 *         description: Server error
 */

const getTodo = (req, res) => {
    db.pool.query("SELECT * FROM todo ORDER BY id ASC;", (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba: ', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json( rows );
    });
};

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subtaskId, relationshipId, sequenceNumber ]
 *             properties:
 *               subtaskId:
 *                 type: integer
 *               relationshipId:
 *                 type: integer
 *               sequenceNumber:
 *                 type: integer
 *               done:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Todo created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 subtaskId:
 *                   type: integer
 *                 relationshipId:
 *                   type: integer
 *                 sequenceNumber:
 *                   type: integer
 *                 done:
 *                   type: boolean
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

const createTodo = (req, res) => {
    const { subtaskId, relationshipId, sequenceNumber, done } = req.body;

   
    if (!subtaskId || !relationshipId || !sequenceNumber) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const query = `
        INSERT INTO todo (subtaskId, relationshipId, sequenceNumber, done)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [subtaskId, relationshipId, sequenceNumber, done ?? false];

    db.pool.query(query, values, (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba a TODO létrehozásakor', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(201).json( rows[0]);
    });
};

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a specific todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 subtaskId:
 *                   type: integer
 *                 relationshipId:
 *                   type: integer
 *                 sequenceNumber:
 *                   type: integer
 *                 done:
 *                   type: boolean
 *       404:
 *         description: Subtask not found
 *       500:
 *         description: Server error
 */

const getTodoById = (req, res) => {
    const id = req.params.id;

    db.pool.query("SELECT * FROM todo WHERE id = $1;", [id], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen todo' });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));

        res.status(200).json( rows[0] );
    });
};

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subtaskId
 *               - relationshipId
 *               - sequenceNumber
 *               - done
 *             properties:
 *                 subtaskId:
 *                   type: integer
 *                 relationshipId:
 *                   type: integer
 *                 sequenceNumber:
 *                   type: integer
 *                 done:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Todo updated
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */

const updateTodo = (req, res) => {
    const id = req.params.id;
    const { subtaskId, relationshipId, sequenceNumber, done } = req.body;

    if (!subtaskId || !relationshipId || !sequenceNumber ) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    db.pool.query(
        "UPDATE todo SET subtaskId = $1, relationshipId = $2, sequenceNumber = $3, done = $4 WHERE id = $5 RETURNING *;",
        [subtaskId, relationshipId, sequenceNumber, done, id],
        (err, result) => {
            if (err) {
                console.error("Hiba:", err);
                return res.status(500).json({ error: 'Hiba', message: err.message });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Nincs ilyen todo' });
            }

            res.status(200).json({ message: 'Todo frissítva' });
        }
    );
};

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */

const deleteTodo = (req, res) => {
    const id = req.params.id;

    db.pool.query("DELETE FROM todo WHERE id = $1 RETURNING id;", [id], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nincs ilyen todo' });
        }

        res.status(200).json({ message: 'Todo törölve' });
    });
};

/**
 * @swagger
 * /todos/relationship/{relationshipId}:
 *   get:
 *     summary: Get a todos for a relationship
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: relationshipId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of todos for a relationship
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   subtaskId:
 *                     type: integer
 *                   relationshipId:
 *                     type: integer
 *                   sequenceNumber:
 *                     type: integer
 *                   done:
 *                     type: boolean
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server error
 */

const getTodosByRelationship = (req, res) => {
    const { relationshipId } = req.params;

    if (!relationshipId) {
        return res.status(400).json({ error: 'Hiányzó kötelező mező' });
    }

    const query = `
        SELECT *
        FROM todo
        WHERE relationshipId = $1
        ORDER BY sequenceNumber;
    `;

    db.pool.query(query, [relationshipId], (err, result) => {
        if (err) {
            console.error("Hiba:", err);
            return res.status(500).json({ error: 'Hiba', message: err.message });
        }

        const rows = result.rows.map(row => ({
            ...row,
             id: parseInt(row.id, 10),  
        }));


        res.status(200).json(rows);
    });
};



module.exports = {
    getAdmins,
    createAdmin,
    getAdminById, 
    updateAdmin,
    updateAdminPassword,
    deleteAdmin,
    getCaregivers,
    createCaregiver,
    getCaregiverById, 
    updateCaregiver,
    updateCaregiverPassword,
    deleteCaregiver,
    getRecipients,
    createRecipient,
    getRecipientById, 
    updateRecipient,
    updateRecipientPassword,
    deleteRecipient,
    addRecipientToCaregiver,
    getRecipientsForCaregiver,
    getCaregiversForRecipient,
    getSchedules,
    createSchedule,
    getScheduleById, 
    updateSchedule,
    deleteSchedule,
    getSchedulesForRecipient,
    getSchedulesForCaregiver,
    getSchedulesForCaregiverAndRecipient,
    createTaskType,
    getTaskType,
    getTaskTypeById,
    createSubTask,
    getSubTask,
    getSubTaskById,
    getSubTasksByTaskType,
    deleteRelationship,
    updateRelationship,
    getAllRelationships,
    getTodo,
    getTodoById,
    getTodosByRelationship,
    updateTodo,
    createTodo,
    deleteTodo
};
