import redis from '../db/redis-client';

async function init() {
    // await redis.set('foo', 'bar');
    // const valueFoo = await redis.get('foo');
    // console.log(valueFoo);

    // await redis.expire('foo', 10);

    // const value = await redis.get('foo');
    // console.log(value);


    // await redis.set("foo", "bar23", "NX");
}

// init();

async function init2() {
    // await redis.lpush("messages",1,2,3,4,5);

    // const messages = await redis.lrange("messages",0,4);
    // console.log(messages);

    // const message = await redis.lpop("messages");
    // console.log(message);

    // const message2 = await redis.lpop("messages");
    // console.log(message2);

    // const message3 = await redis.lpop("messages");
    // console.log(message3);

    // const messages = await redis.blpop("messages",80);
    // console.log(messages);

    // const messages = await redis.brpop("messages",80);
    // console.log(messages);

    const len = await redis.llen("messages");
    console.log(len);

    // await redis.lpush("messages",6, '7', '8', '9', '10');

    // const messages = await redis.lrange("messages",0,-1);
    // console.log(messages);

    const keys = await redis.keys("user:*");
    console.log(keys);

}

// init2();


async function init3() {
    await redis.sadd("IP", "192.168.1.1", "192.168.1.2", "192.168.1.3");

    const ips = await redis.smembers("IP");
    console.log("total ips:", ips);

    const isMember = await redis.sismember("IP", "192.168.1.1");
    console.log("is 192.168.1.1 a member of IP:", isMember);

    const len = await redis.scard("IP");
    console.log("total ips:", len);

    const randomIp = await redis.srandmember("IP");
    console.log("random ip:", randomIp);

    // const removedIp = await redis.srem("IP", "192.168.1.1");
    // console.log("removed ip:",removedIp);

    const ips2 = await redis.smembers("IP");
    console.log("total ips:", ips2);

    await redis.sadd("IP2", "192.168.1.1", "192.168.1.2", "192.168.1.4");

    const union = await redis.sunion("IP", "IP2");
    console.log("union:", union);

    const intersection = await redis.sinter("IP", "IP2");
    console.log("intersection:", intersection);

    const diff = await redis.sdiff("IP", "IP2");
    console.log("diff:", diff);

    const diff2 = await redis.sdiff("IP2", "IP");
    console.log("diff2:", diff2);

    const ip3 = await redis.smembers("IP3");
    console.log("ip3:", ip3);

    // here IP3 is not a set so output is based on IP and IP2
    const diff3 = await redis.sdiff("IP", "IP2", "IP3");
    console.log("diff3:", diff3);



}

// init3();

const init4 = async () => {
    await redis.hset("user:1", {
        name: "John",
        age: 20,
        email: "john@example.com"
    });

    const user = await redis.hgetall("user:1");
    console.log("user:", user);

    const name = await redis.hget("user:1", "name");
    console.log("name:", name);

    const age = await redis.hget("user:1", "age");
    console.log("age:", age);

    const keys = await redis.hkeys("user:1");
    console.log("keys:", keys);

    const values = await redis.hvals("user:1");
    console.log("values:", values);

    const len = await redis.hlen("user:1");
    console.log("length:", len);

    const exists = await redis.hexists("user:1", "name");
    console.log("exists:", exists);

    const fields = await redis.hgetall("user:1");
    console.log("fields:", fields);

    const fieldExists = await redis.hexists("user:1", "name");
    console.log("fieldExists:", fieldExists);

    const removedField = await redis.hdel("user:1", "name");
    console.log("removedField:", removedField);

    const fields2 = await redis.hgetall("user:1");
    console.log("fields2:", fields2);

    const updatedUser = await redis.hset("user:1", {
        name: "John Doe",
        age: 21,
        email: "john.doe@example.com"
    });
    console.log("updatedUser:", updatedUser);

    const updatedUser2 = await redis.hset("user:1", "name", "John Doe");
    console.log("updatedUser2:", updatedUser2);

    const removeUser = await redis.del("user:1");
    console.log("removeUser:", removeUser);

    const user2 = await redis.hgetall("user:1");
    console.log("user2:", user2);


}

// init4();

const readRacerData = async (read: any) => {
    if (read && read[0] && read[0][1]) {
        const entries = read[0][1];
        for (const entry of entries) {
            const [id, data] = entry;
            const racerData = {
                id,
                rider: data[1],
                speed: data[3],
                position: data[5],
                location: data[7]
            };
            console.log("\nRacer Entry:");
            console.log("ID:", racerData.id);
            console.log("Rider:", racerData.rider);
            console.log("Speed:", racerData.speed, "km/h");
            console.log("Position:", racerData.position);
            console.log("Location ID:", racerData.location);
            console.log("-------------------");
        }
    }

}


const init5 = async () => {
    try {
        // Add a new race entry
        // const res1 = await redis.xadd(
        //   'race:france',
        //   '*',
        //   'rider', 'Castilla',
        //   'speed', '31.5',
        //   'position', '1',
        //   'location_id', '1'
        // );
        // console.log("Added entry with ID:", res1);

        // Read from the stream starting from the beginning
        const read = await redis.xread(
            'STREAMS',
            'race:france',
            '0'
        );
        console.log("\n=== Race Data ===");

        readRacerData(read);

        // Read with blocking for new entries
        const readSpeed2 = await redis.xread(
            'BLOCK',
            '1000',
            'STREAMS',
            'race:france',
            '0'
        );
        console.log("\nWaiting for new entries...");
        if (readSpeed2) {
            console.log("New entries received: ==================================");
            readRacerData(readSpeed2);
        }
    } catch (error) {
        console.error("Error in Redis stream operations:", error);
    }
}

init5();