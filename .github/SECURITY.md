# Security Policy

## Supported Versions

| Version  | Supported          |
| -------- | ------------------ |
| Latest   | :white_check_mark: |
| < Latest | :x:                |

## Reporting a Vulnerability

We take the security of Elise Reads seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues.

### 2. Report via GitHub

Use [GitHub Security Advisories](../../security/advisories/new) to privately report vulnerabilities.

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next release cycle

### 4. Responsible Disclosure

We request that you:

- Give us reasonable time to fix the issue before public disclosure
- Do not exploit the vulnerability
- Do not access or modify user data

## Security Measures

### Automated Security

This project uses:

- **Dependabot**: Automated dependency updates
- **npm audit**: Regular vulnerability scanning
- **GitHub Actions**: Security workflows

### Manual Reviews

- Code reviews required for all PRs
- Security-focused code review checklist
- Regular dependency updates

## Scope

### In Scope

- Authentication bypass
- Data exposure
- XSS vulnerabilities
- CSRF vulnerabilities
- Dependency vulnerabilities
- API security issues

### Out of Scope

- Social engineering
- Physical security
- DDoS attacks
- Issues in third-party services (Convex, etc.)
- Rate limiting

## Best Practices

### For Contributors

1. **Never commit secrets**
   - Use `.env` for sensitive data
   - Check `.gitignore` includes `.env`
   - Use environment variables

2. **Sanitize user input**
   - Validate all inputs
   - Use parameterized queries
   - Escape output

3. **Keep dependencies updated**
   - Review Dependabot PRs
   - Run `npm audit` regularly
   - Update critical vulnerabilities immediately

## Contact

For security concerns: Use [GitHub Security Advisories](../../security/advisories/new)

For general issues: Use GitHub Issues

---

**Last Updated**: 2025-04-10
**Next Review**: 2025-07-10
