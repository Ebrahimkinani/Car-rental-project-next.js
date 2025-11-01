# Security Documentation

This document outlines the security measures implemented in the car rental application.

## MongoDB Security Enhancements

### Connection Security
- **TLS/SSL Enforcement**: All MongoDB connections use TLS 1.2+ in production
- **Connection String Validation**: Strict validation of MongoDB URI format
- **Authentication**: Uses admin database for authentication with proper credentials
- **Connection Pooling**: Limited to 10 connections with 2 minimum to prevent resource exhaustion
- **Timeout Configuration**: 
  - Server selection: 10 seconds
  - Socket timeout: 45 seconds
  - Connection timeout: 10 seconds

### Retry Logic & Resilience
- **Exponential Backoff**: Connection retries with increasing delays (1s to 30s max)
- **Maximum Retries**: 5 attempts before failing
- **Graceful Shutdown**: Proper cleanup on process termination
- **Health Checks**: Regular ping to verify connection health

### Data Protection
- **Read/Write Concerns**: 
  - Read concern: majority (only majority-committed data)
  - Write concern: majority with journal (w: 'majority', j: true)
- **Read Preference**: Always read from primary replica
- **Connection Monitoring**: Heartbeat every 10 seconds

### Environment Security
- **Environment Variables**: All sensitive data in `.env.local` (gitignored)
- **Connection String Validation**: Prevents injection attacks
- **Production Warnings**: Alerts for localhost usage in production
- **SSL Validation**: Enforces SSL for Atlas connections in production

## API Security

### Input Validation
- **Type Safety**: All API inputs validated with TypeScript
- **Field Mapping**: Centralized transformation prevents injection
- **Required Fields**: Strict validation of required fields
- **Data Sanitization**: All user inputs sanitized before database operations

### Error Handling
- **Secure Error Messages**: No sensitive data exposed in error responses
- **Logging**: Comprehensive error logging without data exposure
- **Status Codes**: Proper HTTP status codes for different error types

## Database Security

### Schema Security
- **Field Validation**: Mongoose schemas with strict validation
- **Unique Constraints**: Proper unique indexes on critical fields
- **Text Search**: Secure text search indexes
- **Index Optimization**: Performance indexes without security risks

### Connection Security
- **IP Whitelisting**: MongoDB Atlas IP restrictions (configure in Atlas)
- **Network Security**: All connections encrypted in transit
- **Authentication**: Strong authentication with proper user roles
- **Audit Logging**: Connection events logged for security monitoring

## Environment Variables

### 🔒 **NEVER commit sensitive data to version control**

All sensitive information including database credentials, API keys, and secrets must be stored in environment variables.

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Database Name (optional)
MONGODB_DB=car_rental

# Next.js Environment
NODE_ENV=development

# JWT Secret (if using authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# API Keys (if using external services)
# STRIPE_SECRET_KEY=sk_test_...
# SENDGRID_API_KEY=SG...
```

### Environment File Structure

- `.env.local` - Local development environment (DO NOT COMMIT)
- `.env.example` - Template for other developers (safe to commit)
- `.env.production` - Production environment (DO NOT COMMIT)

## Database Security

### MongoDB Atlas Security Features

1. **Network Access Control**
   - Whititelist only necessary IP addresses
   - Use VPC peering for production environments

2. **Authentication**
   - Use strong, unique passwords
   - Enable multi-factor authentication
   - Use database users with minimal required permissions

3. **Encryption**
   - Enable encryption at rest
   - Use TLS/SSL for data in transit

### Connection Security

The application uses secure connection options:

```typescript
const opts = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // IPv4 only
  authSource: 'admin',
  retryWrites: true,
  w: 'majority', // Write concern
};
```

## API Security

### Input Validation

- All API endpoints validate input data
- Mongoose schemas provide built-in validation
- Sanitize user inputs to prevent injection attacks

### Error Handling

- Never expose sensitive information in error messages
- Log errors securely without exposing credentials
- Use generic error messages for client responses

### Rate Limiting

Consider implementing rate limiting for API endpoints:

```typescript
// Example rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## Deployment Security

### Environment Variables in Production

1. **Vercel/Netlify**
   - Set environment variables in dashboard
   - Never commit production credentials

2. **Docker**
   - Use Docker secrets for sensitive data
   - Don't include credentials in Dockerfiles

3. **Server Deployment**
   - Use system environment variables
   - Restrict file permissions on config files

### HTTPS

- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use secure cookies

## Code Security Best Practices

### 1. Dependency Management

```bash
# Regular security audits
npm audit
npm audit fix

# Use specific versions
npm install package@version
```

### 2. Input Sanitization

```typescript
// Sanitize user inputs
import DOMPurify from 'isomorphic-dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);
```

### 3. SQL/NoSQL Injection Prevention

- Use parameterized queries
- Validate all inputs
- Use Mongoose's built-in protection

### 4. Authentication & Authorization

```typescript
// Example JWT implementation
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

## Monitoring & Logging

### Security Logging

```typescript
// Log security events
console.log('Security Event:', {
  timestamp: new Date().toISOString(),
  event: 'failed_login',
  ip: req.ip,
  userAgent: req.get('User-Agent')
});
```

### Error Monitoring

- Use services like Sentry for error tracking
- Monitor for suspicious activities
- Set up alerts for security events

## Checklist

- [ ] All sensitive data in environment variables
- [ ] `.env.local` in `.gitignore`
- [ ] Strong database passwords
- [ ] Network access restrictions
- [ ] HTTPS enabled in production
- [ ] Input validation on all endpoints
- [ ] Error handling without data exposure
- [ ] Regular dependency updates
- [ ] Security monitoring in place

## Incident Response

1. **Immediate Actions**
   - Rotate compromised credentials
   - Review access logs
   - Notify team members

2. **Investigation**
   - Identify attack vector
   - Assess data exposure
   - Document findings

3. **Recovery**
   - Patch vulnerabilities
   - Update security measures
   - Monitor for continued threats

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
