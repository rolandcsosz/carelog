import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function hasExistingData() {
    const counts = await Promise.all([
        prisma.caregiver.count(),
        prisma.recipient.count(),
        prisma.recipientCaregiverRelationship.count(),
        prisma.schedule.count(),
        prisma.taskType.count(),
        prisma.subtask.count(),
        prisma.todo.count(),
    ]);

    return counts.some((count) => count > 0);
}

async function main() {
    const caregivers = await Promise.all([
        prisma.caregiver.create({
            data: {
                name: "Balogh Eszter",
                email: "balogh.eszter@care.hu",
                phone: "06301234567",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa",
            },
        }),
        prisma.caregiver.create({
            data: {
                name: "Varga Zoltán",
                email: "varga.zoltan@care.hu",
                phone: "06309876543",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa",
            },
        }),
        prisma.caregiver.create({
            data: {
                name: "Molnár Ágnes",
                email: "molnar.agnes@care.hu",
                phone: "06305432123",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa",
            },
        }),
        prisma.caregiver.create({
            data: {
                name: "Fehér Dániel",
                email: "feher.daniel@care.hu",
                phone: "06301112223",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa",
            },
        }),
        prisma.caregiver.create({
            data: {
                name: "Pintér Rita",
                email: "pinter.rita@care.hu",
                phone: "06304445566",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa",
            },
        }),
    ]);

    const recipients = await Promise.all([
        prisma.recipient.create({
            data: {
                name: "Kovács Erzsébet",
                email: "kovacs.erzsebet@rec.hu",
                phone: "06305554433",
                address: "Budapest, Bartók Béla út 5.",
                fourHandCareNeeded: false,
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiNyzVPA84cBRtrWhFa",
                caregiverNote: "Idős, lassú mozgású.",
            },
        }),
        prisma.recipient.create({
            data: {
                name: "Szabó János",
                email: "szabo.janos@rec.hu",
                phone: "06304443322",
                address: "Budapest, Petőfi utca 10.",
                fourHandCareNeeded: true,
                caregiverNote: "Mozgássérült, emelni kell.",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa",
            },
        }),
        prisma.recipient.create({
            data: {
                name: "Varga István",
                email: "varga.istvan@rec.hu",
                phone: "06303332211",
                address: "Budapest, Tisza Lajos körút 8.",
                fourHandCareNeeded: false,
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiNyzVPA84cBRtrWhFa",
                caregiverNote: "Cukorbeteg, figyelni kell az étkezésére.",
            },
        }),
        prisma.recipient.create({
            data: {
                name: "Kiss Gábor",
                email: "kiss.gabor@rec.hu",
                phone: "06301110099",
                address: "Budapest, Árpád út 2.",
                fourHandCareNeeded: false,
                caregiverNote: "Hallássérült.",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiNyzVPA84cBRtrWhFa",
            },
        }),
        prisma.recipient.create({
            data: {
                name: "Nagy Géza",
                email: "nagy.geza@rec.hu",
                phone: "06301112223",
                address: "Budapest, Szent István út 1.",
                fourHandCareNeeded: false,
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiNyzVPA84cBRtrWhFa",
                caregiverNote: "",
            },
        }),
    ]);

    const relationships = await Promise.all([
        prisma.recipientCaregiverRelationship.create({
            data: { recipientId: recipients[0].id, caregiverId: caregivers[0].id },
        }),
        prisma.recipientCaregiverRelationship.create({
            data: { recipientId: recipients[1].id, caregiverId: caregivers[0].id },
        }),
        prisma.recipientCaregiverRelationship.create({
            data: { recipientId: recipients[2].id, caregiverId: caregivers[0].id },
        }),
        prisma.recipientCaregiverRelationship.create({
            data: { recipientId: recipients[3].id, caregiverId: caregivers[0].id },
        }),
        prisma.recipientCaregiverRelationship.create({
            data: { recipientId: recipients[4].id, caregiverId: caregivers[0].id },
        }),
    ]);

    await Promise.all([
        prisma.schedule.create({
            data: {
                relationshipId: relationships[0].id,
                date: new Date("2025-06-02"),
                startTime: new Date("2025-06-02T09:00:00"),
                endTime: new Date("2025-06-02T11:00:00"),
            },
        }),
        prisma.schedule.create({
            data: {
                relationshipId: relationships[1].id,
                date: new Date("2025-06-03"),
                startTime: new Date("2025-06-03T10:00:00"),
                endTime: new Date("2025-06-03T12:00:00"),
            },
        }),
        prisma.schedule.create({
            data: {
                relationshipId: relationships[2].id,
                date: new Date("2025-06-04"),
                startTime: new Date("2025-06-04T11:00:00"),
                endTime: new Date("2025-06-04T13:00:00"),
            },
        }),
        prisma.schedule.create({
            data: {
                relationshipId: relationships[3].id,
                date: new Date("2025-06-05"),
                startTime: new Date("2025-06-05T12:00:00"),
                endTime: new Date("2025-06-05T14:00:00"),
            },
        }),
        prisma.schedule.create({
            data: {
                relationshipId: relationships[4].id,
                date: new Date("2025-06-06"),
                startTime: new Date("2025-06-06T13:00:00"),
                endTime: new Date("2025-06-06T15:00:00"),
            },
        }),
    ]);

    const taskTypes = await Promise.all([
        prisma.taskType.create({ data: { type: "Szociális segítség" } }),
        prisma.taskType.create({ data: { type: "Személyi gondozás" } }),
    ]);

    const subtasks = await Promise.all([
        prisma.subtask.create({ data: { title: "Bevásárlás", taskTypeId: taskTypes[0].id } }),
        prisma.subtask.create({ data: { title: "Mosogatás", taskTypeId: taskTypes[0].id } }),
        prisma.subtask.create({ data: { title: "Mosdatás", taskTypeId: taskTypes[1].id } }),
        prisma.subtask.create({ data: { title: "Étkeztetés", taskTypeId: taskTypes[1].id } }),
        prisma.subtask.create({ data: { title: "Folyadékpótlás", taskTypeId: taskTypes[1].id } }),
        prisma.subtask.create({ data: { title: "Vérnyomásmérés", taskTypeId: taskTypes[1].id } }),
    ]);

    await Promise.all([
        prisma.todo.create({
            data: { subtaskId: subtasks[0].id, relationshipId: relationships[0].id, sequenceNumber: 1, done: false },
        }),
        prisma.todo.create({
            data: { subtaskId: subtasks[1].id, relationshipId: relationships[0].id, sequenceNumber: 2, done: false },
        }),
        prisma.todo.create({
            data: { subtaskId: subtasks[2].id, relationshipId: relationships[1].id, sequenceNumber: 1, done: false },
        }),
        prisma.todo.create({
            data: { subtaskId: subtasks[3].id, relationshipId: relationships[2].id, sequenceNumber: 1, done: false },
        }),
        prisma.todo.create({
            data: { subtaskId: subtasks[4].id, relationshipId: relationships[3].id, sequenceNumber: 1, done: false },
        }),
    ]);
}

export const seed = () => {
    hasExistingData()
        .then((exists) => {
            if (exists) {
                console.log("Seed data already exists. Skipping seeding.");
            } else {
                console.log("Seeding initial data...");
                main()
                    .then(() => console.log("Seeding completed."))
                    .catch((e) => console.error("Seeding failed:", e))
                    .finally(async () => await prisma.$disconnect());
            }
        })
        .catch((e) => {
            console.error("Error checking existing data:", e);
        });
};

export const initAdminIfNeeded = async () => {
    const adminCount = await prisma.admin.count();
    if (adminCount < 1) {
        await prisma.admin.create({
            data: {
                name: "Admin",
                email: "admin@admin.hu",
                password: "$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa",
            },
        });
        console.log("Initial admin user created.");
    }
};
