/**
 * Rate Limiter & Math Challenge
 * Anti-bot protection for public queue request submissions
 * - In-memory IP rate limiting
 * - Math challenge with HMAC-signed tokens
 */

import crypto from 'crypto';

// ─── Rate Limiting (In-Memory) ───

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 5;       // max requests
const RATE_LIMIT_WINDOW = 10;   // per N minutes

/**
 * Check if an IP has exceeded the rate limit
 * Returns true if allowed, false if blocked
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW * 60 * 1000,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// ─── Math Challenge ───

const CHALLENGE_SECRET = process.env.CHALLENGE_SECRET || 'qq-challenge-secret-key-2024';
const CHALLENGE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export interface MathChallenge {
  question: string;
  token: string;
}

/**
 * Generate a simple math challenge
 */
export function generateMathChallenge(): MathChallenge {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ['+', '-'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];

  let answer: number;
  let question: string;

  if (op === '+') {
    answer = a + b;
    question = `${a} + ${b} = ?`;
  } else {
    // Ensure non-negative result
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    answer = big - small;
    question = `${big} - ${small} = ?`;
  }

  const timestamp = Date.now().toString();
  const payload = `${answer}:${timestamp}`;
  const signature = crypto
    .createHmac('sha256', CHALLENGE_SECRET)
    .update(payload)
    .digest('hex');

  const token = Buffer.from(`${payload}:${signature}`).toString('base64');

  return { question, token };
}

/**
 * Verify a math challenge answer
 */
export function verifyMathChallenge(token: string, userAnswer: number): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [answerStr, timestampStr, signature] = parts;
    const correctAnswer = parseInt(answerStr, 10);
    const timestamp = parseInt(timestampStr, 10);

    // Check expiry
    if (Date.now() - timestamp > CHALLENGE_EXPIRY_MS) return false;

    // Verify HMAC
    const expectedPayload = `${answerStr}:${timestampStr}`;
    const expectedSignature = crypto
      .createHmac('sha256', CHALLENGE_SECRET)
      .update(expectedPayload)
      .digest('hex');

    if (signature !== expectedSignature) return false;

    // Check answer
    return userAnswer === correctAnswer;
  } catch {
    return false;
  }
}
