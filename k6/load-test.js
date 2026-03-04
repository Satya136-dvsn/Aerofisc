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

// The setup hook runs once before the load test iterations begin.
// We use this to register a single user and generate a JWT token to share among all VUs.
export function setup() {
    const uniqueUser = `loadtest_${Date.now()}@example.com`;
    const password = 'Password123@';
    const timestamp = Date.now();

    // 1. Register
    const registerPayload = JSON.stringify({
        firstName: 'Load',
        lastName: 'Tester',
        username: `tester_${timestamp}`,
        email: uniqueUser,
        password: password,
        role: 'USER',
        monthlyIncome: 5000,
        savingsTarget: 1000
    });

    http.post(`${BASE_URL}/auth/register`, registerPayload, {
        headers: { 'Content-Type': 'application/json' }
    });

    // 2. Login to acquire a valid JWT token
    const loginPayload = JSON.stringify({ email: uniqueUser, password: password });
    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' }
    });

    let token = '';
    try {
        token = loginRes.json('token');
    } catch (e) {
        console.error("Setup login failed to yield JWT token");
    }

    // This returned object is passed into the default function as `data`
    return { token: token };
}

// Default function runs per Virtual User
export default function (data) {
    // If setup failed somehow, we can't test authenticated routes reliably
    if (!data.token) {
        sleep(1);
        return;
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`
    };

    // Hit the dashboard summary API which interacts with the DB and services
    const dashRes = http.get(`${BASE_URL}/dashboard/summary`, { headers: authHeaders });

    check(dashRes, {
        'dashboard responded quickly': (r) => r.timings.duration < 2000,
        'dashboard success status': (r) => r.status === 200,
    });

    sleep(1); // Think time between iterations
}
