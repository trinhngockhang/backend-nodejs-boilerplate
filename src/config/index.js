export default {
  port: process.env.PORT || 3002,
  databaseUrl: process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/kmp3?charset=utf8mb4_unicode_ci&connectionLimit=10&flags=-FOUND_ROWS',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379/0',
  elasticSearchUrl: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
};
