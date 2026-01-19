// Authentication utilities for DeepMine AI Platform
import * as bcrypt from 'bcryptjs'

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate random token for email verification and password reset
 */
export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Generate unique referral code
 */
export function generateReferralCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DM${timestamp}${random}`
}

/**
 * Generate 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * - At least 8 characters
 * - Contains uppercase and lowercase
 * - Contains number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * Validate USDT address (ERC-20 only - Ethereum network)
 */
export function isValidUSDTAddress(address: string, network: 'ERC20' = 'ERC20'): boolean {
  // ERC-20 addresses start with '0x' and are 42 characters
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Generate JWT payload
 */
export function createJWTPayload(userId: number, email: string) {
  return {
    sub: userId,
    email: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
  }
}

/**
 * Sanitize user input (prevent XSS)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Generate contract number
 */
export function generateContractNumber(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `DM-${year}-${random}`
}

/**
 * Generate withdrawal number
 */
export function generateWithdrawalNumber(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `WD-${year}-${random}`
}

/**
 * Calculate expiry date (used for tokens)
 */
export function getExpiryDate(hours: number): string {
  const date = new Date()
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

/**
 * Check if date is expired
 */
export function isExpired(expiryDate: string): boolean {
  return new Date(expiryDate) < new Date()
}
