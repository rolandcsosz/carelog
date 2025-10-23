CREATE TABLE admins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE CHECK (POSITION('@' IN email) > 1), 
    password TEXT NOT NULL
);

CREATE TABLE caregivers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE CHECK (POSITION('@' IN email) > 1), 
    phone VARCHAR(11) NOT NULL CHECK (phone ~ '^[0-9+\-\s]+$'),  
    password TEXT NOT NULL
);

CREATE TABLE recipients (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL CHECK (POSITION('@' IN email) > 1),
    phone VARCHAR(11) NOT NULL CHECK (phone ~ '^[0-9+\-\s]+$'),
    address TEXT NOT NULL,
    four_hand_care_needed BOOLEAN DEFAULT FALSE,
    caregiver_note TEXT,
    password TEXT NOT NULL
);

CREATE TABLE recipients_caregivers (
    relationship_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    recipient_id BIGINT REFERENCES recipients(id)  ON DELETE CASCADE,
    caregiver_id BIGINT REFERENCES caregivers(id)  ON DELETE CASCADE
);

CREATE TABLE schedules (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    relationship_id BIGINT REFERENCES recipients_caregivers(relationship_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE task_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type TEXT NOT NULL
);

CREATE TABLE subTasks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    taskTypeId BIGINT REFERENCES task_types(id)
);

CREATE TABLE todo (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subtaskId BIGINT REFERENCES subTasks(id)  ON DELETE CASCADE,
    relationshipId BIGINT REFERENCES recipients_caregivers(relationship_id)  ON DELETE CASCADE,
    sequenceNumber INTEGER NOT NULL,
    done BOOLEAN DEFAULT FALSE
);



