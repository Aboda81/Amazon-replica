// Snowflake.js

class Snowflake {
    constructor() {
      this.epoch = 1577836800000; // January 1, 2020, in milliseconds
      this.sequence = 0;
      this.sequenceBits = 12;
      this.sequenceMask = (1 << this.sequenceBits) - 1;
      this.lastTimestamp = -1;
    }
  
    generate() {
      let currentTimestamp = Date.now();
      if (currentTimestamp === this.lastTimestamp) {
        this.sequence = (this.sequence + 1) & this.sequenceMask;
        if (this.sequence === 0) {
          // Sequence overflow, wait until next millisecond
          currentTimestamp = this.waitUntilNextMillis();
        }
      } else {
        this.sequence = 0;
      }
  
      this.lastTimestamp = currentTimestamp;
  
      const id = ((currentTimestamp - this.epoch) << (64 - 41)) | (this.sequence << (64 - 41 - this.sequenceBits));
  
      return id.toString();
    }
  
    waitUntilNextMillis() {
      let currentTimestamp = Date.now();
      while (currentTimestamp <= this.lastTimestamp) {
        currentTimestamp = Date.now();
      }
      return currentTimestamp;
    }
  }
  
  module.exports = Snowflake;
  