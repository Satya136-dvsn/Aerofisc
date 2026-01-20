package com.budgetwise.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter implements Filter {

    // Map to store IP address -> (timestamp, count)
    private final Map<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 5;
    private static final long MINUTE_IN_MILLIS = 60000;

    @org.springframework.beans.factory.annotation.Value("${app.ratelimit.enabled:true}")
    private boolean rateLimitEnabled;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (!rateLimitEnabled) {
            chain.doFilter(request, response);
            return;
        }

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestURI = httpRequest.getRequestURI();

        // Only apply rate limiting to auth endpoints
        if (requestURI.startsWith("/api/auth/login") || requestURI.startsWith("/api/auth/register")) {
            String clientIP = getClientIP(httpRequest);

            if (isRateLimited(clientIP)) {
                httpResponse.setStatus(429); // 429 Too Many Requests
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private boolean isRateLimited(String clientIP) {
        long currentTime = System.currentTimeMillis();

        RateLimitInfo info = rateLimitMap.compute(clientIP, (key, existing) -> {
            if (existing == null || currentTime - existing.timestamp > MINUTE_IN_MILLIS) {
                // Reset if no existing entry or window expired
                return new RateLimitInfo(currentTime, 1);
            } else {
                // Increment counter
                existing.count.incrementAndGet();
                return existing;
            }
        });

        return info.count.get() > MAX_REQUESTS_PER_MINUTE;
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Cleanup task to remove old entries
        new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(MINUTE_IN_MILLIS);
                    long currentTime = System.currentTimeMillis();
                    rateLimitMap.entrySet()
                            .removeIf(entry -> currentTime - entry.getValue().timestamp > MINUTE_IN_MILLIS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }).start();
    }

    @Override
    public void destroy() {
        rateLimitMap.clear();
    }

    private static class RateLimitInfo {
        private final long timestamp;
        private final AtomicInteger count;

        public RateLimitInfo(long timestamp, int count) {
            this.timestamp = timestamp;
            this.count = new AtomicInteger(count);
        }
    }
}
