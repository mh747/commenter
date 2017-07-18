var redis = require('redis');

var client = redis.createClient({
  port: (process.env.REDISPORT) ? process.env.REDISPORT : 6379
});

client.on('error', function (err) {
  console.log('error connecting to redis...' + err);
});


// Set eviction method to LRU for caching results
client.config('SET', 'maxmemory-policy', 'allkeys-lru');

module.exports = client;