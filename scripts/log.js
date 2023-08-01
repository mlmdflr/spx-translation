module.exports = {
    error: function (...str) {
        console.error(`\x1B[31m${str.join('')} \x1B[0m`);
    },
    info: function (...str) {
        console.info(`\x1B[34m${str.join('')} \x1B[0m`);
    },
    success: function (...str) {
        console.log(`\x1B[32m${str.join('')} \x1B[0m`);
    },
    warn: function (...str) {
        console.warn(`\x1B[33m${str.join('')} \x1B[0m`);
    }
}