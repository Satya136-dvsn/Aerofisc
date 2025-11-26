package com.budgetwise.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    @org.springframework.context.annotation.Profile("prod")
    public CacheManager redisCacheManager(
            org.springframework.data.redis.connection.RedisConnectionFactory connectionFactory) {
        org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair<Object> jsonSerializer = org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair
                .fromSerializer(new org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer());

        org.springframework.data.redis.cache.RedisCacheConfiguration config = org.springframework.data.redis.cache.RedisCacheConfiguration
                .defaultCacheConfig()
                .entryTtl(java.time.Duration.ofMinutes(10))
                .serializeValuesWith(jsonSerializer);

        return org.springframework.data.redis.cache.RedisCacheManager
                .builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }

    @Bean
    @org.springframework.context.annotation.Profile("!prod")
    public CacheManager simpleCacheManager() {
        return new org.springframework.cache.concurrent.ConcurrentMapCacheManager(
                "dashboard_summary",
                "dashboard_trends",
                "monthly_trends",
                "dashboard_breakdown",
                "category_breakdown",
                "categories",
                "custom_categories",
                "userProfile",
                "predictions");
    }
}

// Note: To use Redis caching, uncomment Redis configuration in
// application.properties
// and replace this with RedisCacheManager configuration
