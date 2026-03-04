import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '1m', target: 100 },  // Spike to 100 users
        { duration: '30s', target: 0 },   // Scale down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate must be < 1%
    },
};

const BASE_URL = 'http://127.0.0.1:8080/api';

export default function () {
    // We assume there's an existing user or we hit a public health endpoint for load
    // Hitting the dashboard summary requires a token, so we'll simulate a login if needed,
    // or we'll hit an unsecured/fake secured route if k6 doesn't have valid DB credentials
    const loginPayload = JSON.stringify({
        email: 'test@example.com',
        password: 'Password123@'
    });

    const headers = { 'Content-Type': 'application/json' };

    // 1. Authenticate
    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });

    // Check if login is successful (we might get 401 if user isn't seeded, but we still measure API response time)
    check(loginRes, {
        'login responded quickly': (r) => r.timings.duration < 1000,
    });

    // Extract token if successful
    let token = '';
    if (loginRes.status === 200) {
        try {
            token = loginRes.json('token');
        } catch (e) { }
    }

    // 2. Fetch Dashboard with or without token (testing rate limits/rejection speeds)
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const dashRes = http.get(`${BASE_URL}/dashboard/summary`, { headers: authHeaders });
    check(dashRes, {
        'dashboard responded quickly': (r) => r.timings.duration < 2000,
    });

    sleep(1); // Think time between iterations
}
