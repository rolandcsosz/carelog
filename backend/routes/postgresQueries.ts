import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../db.js";
import { Admin, Caregiver, Recipient, Relationship, Schedule, TaskType, SubTask, Todo } from "../model.js";
import { getErrorMessage } from "../utils.js";

const parseRows = <T>(rows: unknown): T[] => {
    if (!Array.isArray(rows)) {
        return [];
    }

    try {
        return rows.map((row) => ({ ...(row as T) }));
    } catch {
        return [];
    }
};

export const getAdmins = async (_req: Request, res: Response) => {
    try {
        const result = await db.query("SELECT id, name, email FROM admins ORDER BY id ASC");
        res.status(200).json(parseRows<Admin>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Hiányzó mező" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query("INSERT INTO admins (name, email, password) VALUES ($1,$2,$3) RETURNING *", [
            name,
            email,
            hashedPassword,
        ]);

        const rows = parseRows<Admin>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült az admin létrehozása");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba az admin létrehozásakor", message: getErrorMessage(err) });
    }
};

export const getAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT id, name, email FROM admins WHERE id=$1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen admin" });
        const rows = parseRows<Admin>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült az admin lekérése");
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Hiányzó mező" });

    try {
        const result = await db.query("UPDATE admins SET name=$1,email=$2 WHERE id=$3 RETURNING id,name,email", [
            name,
            email,
            id,
        ]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen admin" });
        res.status(200).send("Admin frissítve");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateAdminPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Hiányzó mező" });

    try {
        const result = await db.query("SELECT password FROM admins WHERE id=$1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen admin" });

        const rows = parseRows<Admin>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült az admin lekérése");
        }

        const storedHash = result.rows[0].password;
        const isValid = await bcrypt.compare(currentPassword, storedHash);
        if (!isValid) return res.status(400).json({ error: "Helytelen régi jelszó" });

        const newHash = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE admins SET password=$1 WHERE id=$2", [newHash, id]);
        res.status(200).send("Sikeres jelszó változtatás");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM admins WHERE id=$1 RETURNING id", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen admin" });
        res.status(200).send("Admin törölve");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getCaregivers = async (_req: Request, res: Response) => {
    try {
        const result = await db.query("SELECT id, name, phone, email FROM caregivers ORDER BY id ASC");
        res.status(200).json(parseRows<Caregiver>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const createCaregiver = async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            "INSERT INTO caregivers (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, phone, hashedPassword],
        );

        const rows = parseRows<Caregiver>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozó létrehozása");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba a gondozó létrehozásakor", message: getErrorMessage(err) });
    }
};

export const getCaregiverById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT id, name, phone, email FROM caregivers WHERE id=$1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozó" });
        const rows = parseRows<Caregiver>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozó lekérése");
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateCaregiver = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query(
            "UPDATE caregivers SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING id, name, email, phone",
            [name, email, phone, id],
        );
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozó" });
        const rows = parseRows<Caregiver>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozó lekérése");
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateCaregiverPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query("SELECT password FROM caregivers WHERE id=$1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozó" });

        const rows = parseRows<Caregiver>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozó lekérése");
        }

        const storedHash = rows[0].password;
        const isValid = await bcrypt.compare(currentPassword, storedHash);
        if (!isValid) return res.status(400).json({ error: "Helytelen régi jelszó" });

        const newHash = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE caregivers SET password=$1 WHERE id=$2", [newHash, id]);
        res.status(200).send("Sikeres jelszó változtatás");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const deleteCaregiver = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM caregivers WHERE id=$1 RETURNING id", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozó" });
        res.status(200).send("Gondozó törölve");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getRecipients = async (_req: Request, res: Response) => {
    try {
        const result = await db.query(
            `SELECT id, name, email, phone, address, four_hand_care_needed, caregiver_note
       FROM recipients ORDER BY id ASC`,
        );
        res.status(200).json(parseRows<Recipient>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const createRecipient = async (req: Request, res: Response) => {
    const { name, email, phone, address, four_hand_care_needed, caregiver_note, password } = req.body;
    if (!name || !email || !phone || !address || !password)
        return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO recipients
        (name, email, phone, address, four_hand_care_needed, caregiver_note, password)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, name, email, phone, address, four_hand_care_needed, caregiver_note`,
            [name, email, phone, address, four_hand_care_needed, caregiver_note, hashedPassword],
        );

        const rows = parseRows<Recipient>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozott létrehozása");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba a gondozott létrehozásakor", message: getErrorMessage(err) });
    }
};

export const getRecipientById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT id, name, email, phone, address, four_hand_care_needed, caregiver_note
       FROM recipients WHERE id=$1`,
            [id],
        );
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozott" });

        const rows = parseRows<Recipient>(result.rows);
        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozott lekérése");
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateRecipient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, address, four_hand_care_needed, caregiver_note } = req.body;
    if (!name || !email || !phone || !address) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query(
            `UPDATE recipients
       SET name=$1, email=$2, phone=$3, address=$4, four_hand_care_needed=$5, caregiver_note=$6
       WHERE id=$7
       RETURNING id, name, email, phone, address, four_hand_care_needed, caregiver_note`,
            [name, email, phone, address, four_hand_care_needed, caregiver_note, id],
        );
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozott" });
        res.status(200).send("Gondozott frissítve");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateRecipientPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query("SELECT password FROM recipients WHERE id=$1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozott" });

        const rows = parseRows<Recipient>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozott lekérése");
        }

        const storedHash = rows[0].password;
        const isValid = await bcrypt.compare(currentPassword, storedHash);
        if (!isValid) return res.status(400).json({ error: "Helytelen régi jelszó" });

        const newHash = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE recipients SET password=$1 WHERE id=$2", [newHash, id]);
        res.status(200).send("Sikeres jelszó változtatás");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const deleteRecipient = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM recipients WHERE id=$1 RETURNING id", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen gondozott" });
        res.status(200).send("Gondozott törölve");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const addRecipientToCaregiver = async (req: Request, res: Response) => {
    const { recipientId, caregiverId } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO recipients_caregivers (recipient_id, caregiver_id) VALUES ($1, $2) RETURNING *",
            [recipientId, caregiverId],
        );

        const rows = parseRows<Relationship>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a gondozott hozzáadása a gondozóhoz");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba a gondozott hozzáadásakor a gondozóhoz", message: getErrorMessage(err) });
    }
};

export const getCaregiversForRecipient = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT c.id, c.name, c.phone, c.email, rc.relationship_id
       FROM caregivers c
       JOIN recipients_caregivers rc ON c.id = rc.caregiver_id
       WHERE rc.recipient_id=$1`,
            [id],
        );
        res.status(200).json(parseRows<Caregiver & { relationship_id: number }>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getRecipientsForCaregiver = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT r.id, r.name, r.phone, r.email, r.address, rc.relationship_id
       FROM recipients r
       JOIN recipients_caregivers rc ON r.id = rc.recipient_id
       WHERE rc.caregiver_id=$1`,
            [id],
        );
        res.status(200).json(parseRows<Recipient & { relationship_id: number }>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const deleteRelationship = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM recipients_caregivers WHERE relationship_id=$1 RETURNING *", [id]);
        if (!result.rows.length) return res.status(404).json({ message: "Relationship not found" });
        res.status(200).send("Relationship deleted");
    } catch (err) {
        res.status(500).json({ error: "Error deleting relationship", message: getErrorMessage(err) });
    }
};

export const updateRelationship = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { recipientId, caregiverId } = req.body;
    try {
        const result = await db.query(
            "UPDATE recipients_caregivers SET recipient_id=$1, caregiver_id=$2 WHERE relationship_id=$3 RETURNING *",
            [recipientId, caregiverId, id],
        );
        if (!result.rows.length) return res.status(404).json({ message: "Relationship not found" });
        res.status(200).send("Relationship updated");
    } catch (err) {
        res.status(500).json({ error: "Error updating relationship", message: getErrorMessage(err) });
    }
};

export const getAllRelationships = async (_req: Request, res: Response) => {
    try {
        const result = await db.query(
            `SELECT 
         rc.relationship_id,
         rc.recipient_id,
         r.name AS recipient_name,
         rc.caregiver_id,
         c.name AS caregiver_name
       FROM recipients_caregivers rc
       JOIN recipients r ON rc.recipient_id = r.id
       JOIN caregivers c ON rc.caregiver_id = c.id`,
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Server error", message: getErrorMessage(err) });
    }
};

export const createSchedule = async (req: Request, res: Response) => {
    const { relationship_id, date, start_time, end_time } = req.body;
    if (!relationship_id || !date || !start_time || !end_time)
        return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query(
            "INSERT INTO schedules (relationship_id, date, start_time, end_time) VALUES ($1,$2,$3,$4) RETURNING *",
            [relationship_id, date, start_time, end_time],
        );

        const rows = parseRows<Schedule>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a beosztás létrehozása");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba a beosztás létrehozásakor", message: getErrorMessage(err) });
    }
};

export const getSchedules = async (_req: Request, res: Response) => {
    try {
        const result = await db.query("SELECT * FROM schedules ORDER BY id ASC");
        res.status(200).json(parseRows<Schedule>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getScheduleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM schedules WHERE id=$1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen beosztás" });

        const rows = parseRows<Schedule>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a beosztás lekérése");
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateSchedule = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { relationship_id, date, start_time, end_time } = req.body;
    if (!relationship_id || !date || !start_time || !end_time)
        return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query(
            "UPDATE schedules SET relationship_id=$1, date=$2, start_time=$3, end_time=$4 WHERE id=$5 RETURNING *",
            [relationship_id, date, start_time, end_time, id],
        );
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen beosztás" });
        res.status(200).send("Beosztás frissítve");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const deleteSchedule = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM schedules WHERE id=$1 RETURNING id", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen beosztás" });
        res.status(200).send("Beosztás törölve");
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getSchedulesForCaregiver = async (req: Request, res: Response) => {
    const { caregiverId } = req.params;
    try {
        const result = await db.query(
            "SELECT * FROM schedules WHERE relationship_id IN (SELECT relationship_id FROM recipients_caregivers WHERE caregiver_id=$1)",
            [caregiverId],
        );
        if (!result.rows.length) return res.status(404).json({ error: "Nincs beosztás ehhez a gondozóhoz" });
        res.status(200).json(parseRows<Schedule>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getSchedulesForRecipient = async (req: Request, res: Response) => {
    const { recipientId } = req.params;
    try {
        const result = await db.query(
            "SELECT * FROM schedules WHERE relationship_id IN (SELECT relationship_id FROM recipients_caregivers WHERE recipient_id=$1)",
            [recipientId],
        );
        if (!result.rows.length) return res.status(404).json({ error: "Nincs beosztás ehhez a gondozotthoz" });
        res.status(200).json(parseRows<Schedule>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getSchedulesForCaregiverAndRecipient = async (req: Request, res: Response) => {
    const { caregiverId, recipientId } = req.params;

    try {
        const result = await db.query(
            `SELECT s.* 
       FROM schedules s
       JOIN recipients_caregivers rc ON s.relationship_id = rc.relationship_id
       WHERE rc.caregiver_id = $1 AND rc.recipient_id = $2`,
            [caregiverId, recipientId],
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: "Ennnek a gondozónak nincs beosztása ehhez a gondozotthoz" });
        }

        res.status(200).json(parseRows<Schedule>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const createTaskType = async (req: Request, res: Response) => {
    const { type } = req.body;
    if (!type) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query("INSERT INTO task_types (type) VALUES ($1) RETURNING *", [type]);
        const rows = parseRows<TaskType>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a típus létrehozása");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba a típus létrehozásakor", message: getErrorMessage(err) });
    }
};

export const getTaskType = async (_req: Request, res: Response) => {
    try {
        const result = await db.query("SELECT * FROM task_types ORDER BY id ASC");
        res.status(200).json(parseRows<TaskType>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getTaskTypeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM task_types WHERE id = $1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen típus" });

        const rows = parseRows<TaskType>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a típus lekérése");
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const createSubTask = async (req: Request, res: Response) => {
    const { title, taskTypeId } = req.body;
    if (!title || !taskTypeId) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query("INSERT INTO subTasks (title, taskTypeId) VALUES ($1, $2) RETURNING *", [
            title,
            taskTypeId,
        ]);

        const rows = parseRows<SubTask>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a tevékenység létrehozása");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba a tevékenység létrehozásakor", message: getErrorMessage(err) });
    }
};

export const getSubTask = async (_req: Request, res: Response) => {
    try {
        const result = await db.query("SELECT * FROM subTasks ORDER BY id ASC");
        res.status(200).json(parseRows<SubTask>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getSubTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM subTasks WHERE id = $1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen tevékenység" });

        const rows = parseRows<SubTask>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a tevékenység lekérése");
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getSubTasksByTaskType = async (req: Request, res: Response) => {
    const { taskTypeId } = req.params;

    try {
        const result = await db.query("SELECT * FROM subTasks WHERE taskTypeId = $1", [taskTypeId]);
        if (!result.rows.length) return res.status(404).json({ message: "Nincs ilyen típusú tevékenység." });

        res.status(200).json(parseRows<SubTask>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getTodo = async (_req: Request, res: Response) => {
    try {
        const result = await db.query("SELECT * FROM todo ORDER BY id ASC");
        res.status(200).json(parseRows<Todo>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const createTodo = async (req: Request, res: Response) => {
    const { subtaskId, relationshipId, sequenceNumber, done } = req.body;
    if (!subtaskId || !relationshipId || !sequenceNumber) {
        return res.status(400).json({ error: "Hiányzó kötelező mező" });
    }

    try {
        const result = await db.query(
            `INSERT INTO todo (subtaskId, relationshipId, sequenceNumber, done)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [subtaskId, relationshipId, sequenceNumber, done ?? false],
        );

        const rows = parseRows<Todo>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a TODO létrehozása");
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba a TODO létrehozásakor", message: getErrorMessage(err) });
    }
};

export const getTodoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM todo WHERE id = $1", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen todo" });

        const rows = parseRows<Todo>(result.rows);

        if (rows.length === 0) {
            throw new Error("Nem sikerült a todo lekérése");
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { subtaskId, relationshipId, sequenceNumber, done } = req.body;
    if (!subtaskId || !relationshipId || !sequenceNumber) {
        return res.status(400).json({ error: "Hiányzó kötelező mező" });
    }

    try {
        const result = await db.query(
            "UPDATE todo SET subtaskId = $1, relationshipId = $2, sequenceNumber = $3, done = $4 WHERE id = $5 RETURNING *",
            [subtaskId, relationshipId, sequenceNumber, done ?? false, id],
        );

        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen todo" });

        res.status(200).json({ message: "Todo frissítve" });
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM todo WHERE id = $1 RETURNING id", [id]);
        if (!result.rows.length) return res.status(404).json({ error: "Nincs ilyen todo" });

        res.status(200).json({ message: "Todo törölve" });
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export const getTodosByRelationship = async (req: Request, res: Response) => {
    const { relationshipId } = req.params;
    if (!relationshipId) return res.status(400).json({ error: "Hiányzó kötelező mező" });

    try {
        const result = await db.query("SELECT * FROM todo WHERE relationshipId = $1 ORDER BY sequenceNumber", [
            relationshipId,
        ]);
        res.status(200).json(parseRows<Todo>(result.rows));
    } catch (err) {
        res.status(500).json({ error: "Hiba", message: getErrorMessage(err) });
    }
};

export default {
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
    deleteTodo,
};
