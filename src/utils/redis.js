import { createClient } from "redis";

const redisClient=createClient({
    url:process.env.REDIS_URL
});

redisClient.on("error",(err)=>{
    //  console.log("Redis Error:", err);
});
async function connectRedis() {
    await redisClient.connect();
    console.log("Redis Connected");
}
export {redisClient,connectRedis};