const crypto = require('crypto');

if (process.env.NODE_ENV === 'production' && !process.env.COALTRACK_JWT_SECRET) {
  throw new Error('COALTRACK_JWT_SECRET must be set when NODE_ENV=production');
}

const JWT_SECRET = process.env.COALTRACK_JWT_SECRET || 'coaltrack-development-secret-change-me';
const TOKEN_TTL_SECONDS = 8 * 60 * 60;

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(value) {
  return crypto.createHmac('sha256', JWT_SECRET).update(value).digest('base64url');
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) return false;

  const [salt, expectedHex] = storedHash.split(':');
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function issueToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    mine_id: user.mine_id || null,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS
  }));
  const unsigned = `${header}.${payload}`;
  return `${unsigned}.${sign(unsigned)}`;
}

function verifyToken(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Invalid token');

  const [header, payload, signature] = parts;
  const unsigned = `${header}.${payload}`;
  const expected = sign(unsigned);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    throw new Error('Invalid token');
  }

  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) throw new Error('Expired token');
  return claims;
}

function authenticate(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Authentication required' });

  try {
    req.user = verifyToken(match[1]);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    return next();
  };
}

module.exports = {
  allowRoles,
  authenticate,
  hashPassword,
  issueToken,
  verifyPassword,
  verifyToken
};
