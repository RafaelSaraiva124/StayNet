import { Redis } from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  return "redis://localhost:6379";
};

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true,
});

redis.connect().catch((err) => {
  console.error("Erro ao conectar ao Redis:", err);
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redis.on("connect", () => {
  console.log("Redis conectado com sucesso");
});

export async function createTemporaryHold(
  roomId: string,
  checkIn: string,
  checkOut: string,
  userId: string,
): Promise<string> {
  const holdId = `hold:${roomId}:${Date.now()}:${userId}`;
  const holdData = {
    roomId,
    checkIn,
    checkOut,
    userId,
    createdAt: new Date().toISOString(),
  };

  await redis.setex(holdId, 1800, JSON.stringify(holdData));
  return holdId;
}

export async function getActiveHolds(
  roomId: string,
  checkIn: string,
  checkOut: string,
): Promise<number> {
  const pattern = `hold:${roomId}:*`;
  const keys = await redis.keys(pattern);

  let count = 0;
  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const hold = JSON.parse(data);
      if (hold.checkIn < checkOut && hold.checkOut > checkIn) {
        count++;
      }
    }
  }

  return count;
}

export async function releaseHold(holdId: string): Promise<void> {
  await redis.del(holdId);
}

export async function extendHold(holdId: string): Promise<boolean> {
  const ttl = await redis.ttl(holdId);
  if (ttl > 0) {
    await redis.expire(holdId, 1800);
    return true;
  }
  return false;
}
