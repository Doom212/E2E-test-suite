import { test, expect } from '@playwright/test';

/**
 * API-level tests using Playwright's built-in `request` fixture.
 * These run without a browser, so they're fast and are a good place
 * to validate backend contracts independently of the UI.
 *
 * Target: https://reqres.in - a free hosted mock REST API, chosen so
 * this suite is runnable with zero setup. Swap `API_BASE` for your
 * own service's base URL when adapting this project.
 */
const API_BASE = 'https://reqres.in/api';

test.describe('Users API', () => {
  test('GET /users/2 returns a single user with expected shape', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/2`, {
      headers: { 'x-api-key': 'reqres-free-v1' },
    });
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.data).toMatchObject({
      id: 2,
      email: expect.stringContaining('@'),
      first_name: expect.any(String),
      last_name: expect.any(String),
    });
  });

  test('GET /users?page=2 returns paginated results', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?page=2`, {
      headers: { 'x-api-key': 'reqres-free-v1' },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('POST /users creates a user and echoes submitted fields', async ({ request }) => {
    const payload = { name: 'Ada Lovelace', job: 'QA Automation Engineer' };
    const response = await request.post(`${API_BASE}/users`, {
      headers: { 'x-api-key': 'reqres-free-v1' },
      data: payload,
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject(payload);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
  });

  test('GET /users/23 (nonexistent) returns 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/23`, {
      headers: { 'x-api-key': 'reqres-free-v1' },
    });
    expect(response.status()).toBe(404);
  });

  test('DELETE /users/2 returns 204 No Content', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/users/2`, {
      headers: { 'x-api-key': 'reqres-free-v1' },
    });
    expect(response.status()).toBe(204);
  });
});
