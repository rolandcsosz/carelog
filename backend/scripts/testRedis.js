import Redis from "ioredis";

const redis = new Redis({ host: "localhost", port: 6379 });

async function checkRedis(userId) {
    const tokens = await redis.lrange(`chat:${userId}:tokens`, 0, -1);
    console.log("Stored tokens:", tokens);
    redis.subscribe(`chat:${userId}`, () => {
        console.log(`Subscribed to chat:${userId}`);
    });
    redis.on("message", (channel, message) => {
        console.log(`Received pub/sub message on ${channel}:`, message);
    });
}

checkRedis("id");
