import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { prisma } from '../src/config/db'
import { cleanDatabase, uniqueEmail, uniqueUsername } from './helpers'

const app = createApp()

afterAll(async () => {
  await prisma.$disconnect()
})

beforeEach(async () => {
  await cleanDatabase()
})

describe('POST /api/auth/register', () => {
  it('returns user and token for valid input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: uniqueEmail(),
      username: uniqueUsername(),
      displayName: 'Test User',
      password: 'password123',
    })

    expect(res.status).toBe(201)
    expect(res.body.user).toMatchObject({
      gems: 0,
      totalXP: 0,
      streak: 0,
    })
    expect(res.body.user.id).toBeTypeOf('string')
    expect(res.body.token).toBeTypeOf('string')
    expect(res.body.user).not.toHaveProperty('passwordHash')
  })

  it('rejects short password with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: uniqueEmail(),
      username: uniqueUsername(),
      displayName: 'X',
      password: '123',
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toContain('Validatsiya')
    expect(res.body.details.password).toBeTruthy()
  })

  it('rejects duplicate email with 409', async () => {
    const email = uniqueEmail()
    await request(app).post('/api/auth/register').send({
      email,
      username: uniqueUsername(),
      displayName: 'First',
      password: 'password123',
    })

    const res = await request(app).post('/api/auth/register').send({
      email,
      username: uniqueUsername('other'),
      displayName: 'Second',
      password: 'password123',
    })
    expect(res.status).toBe(409)
    expect(res.body.error).toContain('email')
  })
})

describe('POST /api/auth/login', () => {
  it('returns token on correct credentials', async () => {
    const email = uniqueEmail()
    const password = 'password123'
    await request(app).post('/api/auth/register').send({
      email,
      username: uniqueUsername(),
      displayName: 'L',
      password,
    })

    const res = await request(app).post('/api/auth/login').send({ email, password })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeTypeOf('string')
  })

  it('rejects wrong password with 401', async () => {
    const email = uniqueEmail()
    await request(app).post('/api/auth/register').send({
      email,
      username: uniqueUsername(),
      displayName: 'W',
      password: 'password123',
    })

    const res = await request(app).post('/api/auth/login').send({
      email,
      password: 'wrongpass1',
    })
    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('returns user when authenticated', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: uniqueEmail(),
      username: uniqueUsername(),
      displayName: 'Me',
      password: 'password123',
    })
    const token = reg.body.token

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ displayName: 'Me' })
    expect(res.body.user.lives).toMatchObject({ current: 5, max: 5 })
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token')
    expect(res.status).toBe(401)
  })
})
