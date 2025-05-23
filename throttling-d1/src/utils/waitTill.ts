export const waitTill = (timestamp: number) => new Promise((resolve) => {
    const now = Date.now();
    const newTime = Date.now() + timestamp;
    if(now < newTime) {
        setTimeout(resolve, newTime - now);
    } else {
        resolve(true);
    }
});