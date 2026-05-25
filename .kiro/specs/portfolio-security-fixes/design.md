# Portfolio Security Fixes Bugfix Design

## Overview

Proyek portfolio Next.js memiliki beberapa kerentanan keamanan kritis dan masalah kualitas kode yang memerlukan perbaikan sistematis. Design ini menggunakan bug condition methodology untuk mengidentifikasi dan memperbaiki masalah keamanan (fallback secret berbahaya, tidak ada rate limiting, input sanitization lemah), error handling yang tidak konsisten, test coverage minimal, dan masalah performa. Pendekatan fix akan berfokus pada implementasi security middleware, centralized error handling, input validation, dan monitoring yang komprehensif tanpa merusak existing functionality.

## Glossary

- **Bug_Condition (C)**: Kondisi yang memicu kerentanan keamanan - ketika aplikasi berjalan dengan konfigurasi tidak aman atau menerima input berbahaya tanpa validasi
- **Property (P)**: Perilaku keamanan yang diinginkan - aplikasi harus menolak konfigurasi tidak aman dan memvalidasi semua input
- **Preservation**: Existing OAuth flow, API responses, dan UI functionality yang harus tetap berfungsi tanpa perubahan
- **authOptions**: Konfigurasi NextAuth di `common/libs/auth.ts` yang menangani OAuth providers
- **checkAdminAuth**: Fungsi di `common/libs/adminAuth.ts` yang melakukan simple token comparison untuk admin authentication
- **Rate Limiting**: Pembatasan jumlah request per IP address dalam periode waktu tertentu
- **Input Sanitization**: Proses membersihkan dan memvalidasi input user untuk mencegah XSS dan injection attacks

## Bug Details

### Bug Condition

Bug manifests ketika aplikasi berjalan dengan konfigurasi keamanan yang tidak aman atau menerima input yang berpotensi berbahaya. Sistem saat ini tidak memiliki validasi konfigurasi startup, rate limiting, input sanitization yang memadai, error boundaries, dan menggunakan authentication method yang rentan timing attacks.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type SystemState | APIRequest | AuthRequest
  OUTPUT: boolean
  
  RETURN (input.type == "startup" AND process.env.NEXTAUTH_SECRET == undefined)
         OR (input.type == "api_request" AND input.requestCount > RATE_LIMIT AND input.timeWindow < 15_minutes)
         OR (input.type == "api_request" AND containsMaliciousContent(input.body))
         OR (input.type == "component_error" AND NOT hasErrorBoundary(input.component))
         OR (input.type == "admin_auth" AND usesSimpleComparison(input.token))
         OR (input.type == "image_request" AND input.hostname NOT IN whitelistedDomains)
END FUNCTION
```

### Examples

- **Startup tanpa NEXTAUTH_SECRET**: Aplikasi start dengan `process.env.NEXTAUTH_SECRET` undefined, menggunakan "fallback_secret_for_portfolio" yang dapat diprediksi
- **Rate Limiting**: API endpoint menerima 1000+ requests dalam 1 menit dari IP yang sama tanpa pembatasan
- **Input Sanitization**: POST request ke `/api/admin/articles` dengan payload `{"title": "<script>alert('xss')</script>"}` tidak di-sanitize
- **Error Boundary**: React component crash menyebabkan seluruh aplikasi white screen tanpa fallback UI
- **Admin Auth Timing**: `checkAdminAuth()` menggunakan `token === expectedToken` yang rentan timing attacks
- **Image Security**: `next.config.mjs` menggunakan `hostname: "**"` yang menerima gambar dari domain berbahaya
- **Error Exposure**: API error mengembalikan stack trace lengkap yang mengekspos informasi sensitif

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- OAuth login dengan Google dan GitHub harus tetap berfungsi dengan flow yang sama
- API endpoints yang sudah ada harus memberikan response format yang sama untuk input valid
- Admin CRUD operations pada articles, awards, achievements harus tetap berfungsi dengan authorization yang tepat
- Portfolio content display (projects, articles, achievements) harus tetap menampilkan data dengan format dan styling yang sama
- Internationalization harus tetap menampilkan konten dalam bahasa yang dipilih
- Supabase database operations harus tetap berfungsi dengan connection dan queries yang sama
- Build process harus tetap menghasilkan production build yang valid
- Existing tests harus tetap pass

**Scope:**
Semua input dan operasi yang TIDAK melibat konfigurasi keamanan, rate limiting, atau input validation harus tetap tidak terpengaruh oleh fix ini. Termasuk:
- Valid OAuth authentication flows
- Valid API requests dengan input yang sudah benar
- Normal component rendering tanpa errors
- Valid admin operations dengan proper authentication
- Images dari domain yang sudah whitelisted

## Hypothesized Root Cause

Berdasarkan analisis bug description dan codebase, kemungkinan penyebab utama adalah:

1. **Insecure Configuration Management**: Aplikasi tidak memvalidasi environment variables yang critical untuk keamanan saat startup
   - `authOptions` di `common/libs/auth.ts` menggunakan fallback secret yang predictable
   - Tidak ada validation untuk required environment variables

2. **Missing Security Middleware**: Tidak ada rate limiting atau security headers implementation
   - API routes tidak memiliki rate limiting middleware
   - Tidak ada protection terhadap brute force attacks

3. **Inadequate Input Validation**: Input sanitization tidak konsisten across API endpoints
   - API routes menerima raw input tanpa validation schema
   - Tidak ada centralized input sanitization

4. **Weak Authentication Implementation**: Admin authentication menggunakan simple comparison
   - `checkAdminAuth()` di `common/libs/adminAuth.ts` menggunakan `===` operator yang rentan timing attacks
   - Tidak menggunakan constant-time comparison

5. **Missing Error Boundaries**: Tidak ada error boundary components untuk menangkap React errors
   - Component crashes menyebabkan white screen
   - Tidak ada graceful error handling di UI layer

6. **Overly Permissive Image Configuration**: `next.config.mjs` menggunakan wildcard hostname
   - `hostname: "**"` menerima images dari domain apapun
   - Berpotensi untuk image-based attacks

## Correctness Properties

Property 1: Bug Condition - Security Configuration Validation

_For any_ system startup where critical security environment variables are missing (NEXTAUTH_SECRET is undefined), the fixed application SHALL refuse to start and display a clear error message about the missing required configuration.

**Validates: Requirements 2.1**

Property 2: Bug Condition - Rate Limiting Protection

_For any_ API request where the request count exceeds the defined limit (100 requests per 15 minutes per IP), the fixed system SHALL return a 429 Too Many Requests response and block further requests until the rate limit window resets.

**Validates: Requirements 2.2**

Property 3: Bug Condition - Input Sanitization

_For any_ API request containing potentially malicious content (XSS scripts, SQL injection patterns, or other dangerous input), the fixed system SHALL sanitize or reject the input and prevent the malicious content from being processed or stored.

**Validates: Requirements 2.3**

Property 4: Bug Condition - Error Boundary Protection

_For any_ React component error that would normally crash the application, the fixed system SHALL display an error boundary with a user-friendly fallback UI instead of a white screen.

**Validates: Requirements 2.4**

Property 5: Bug Condition - Secure Authentication

_For any_ admin authentication attempt, the fixed system SHALL use constant-time comparison methods that are resistant to timing attacks instead of simple equality comparison.

**Validates: Requirements 2.7**

Property 6: Preservation - OAuth Flow Functionality

_For any_ OAuth authentication request (Google or GitHub) that worked correctly before the fix, the fixed system SHALL produce exactly the same authentication flow and user experience as the original system.

**Validates: Requirements 3.1**

Property 7: Preservation - API Response Consistency

_For any_ valid API request that previously returned correct responses, the fixed system SHALL return responses with the same format, structure, and data as the original system.

**Validates: Requirements 3.2, 3.4**

Property 8: Preservation - Admin Operations

_For any_ valid admin CRUD operation on articles, awards, or achievements, the fixed system SHALL maintain the same functionality and authorization behavior as the original system.

**Validates: Requirements 3.3**

## Fix Implementation

### Changes Required

Berdasarkan root cause analysis, implementasi fix akan melibatkan beberapa komponen baru dan modifikasi pada existing code:

**File**: `common/libs/auth.ts`

**Function**: `authOptions`

**Specific Changes**:
1. **Environment Validation**: Tambahkan startup validation untuk NEXTAUTH_SECRET
   - Buat function `validateRequiredEnvVars()` yang check critical environment variables
   - Throw error dengan message yang jelas jika NEXTAUTH_SECRET missing
   - Remove fallback secret yang tidak aman

**File**: `middleware.ts` (new file)

**Function**: Rate limiting dan security middleware

**Specific Changes**:
2. **Rate Limiting Middleware**: Implementasi rate limiting per IP address
   - Gunakan in-memory store atau Redis untuk tracking request counts
   - Implement sliding window rate limiting (100 requests per 15 minutes)
   - Return 429 status code ketika limit exceeded

3. **Security Headers**: Tambahkan security headers middleware
   - Implement CSP (Content Security Policy)
   - Add X-Frame-Options, X-Content-Type-Options headers
   - Configure HSTS headers

**File**: `common/libs/input-validation.ts` (new file)

**Function**: Centralized input sanitization

**Specific Changes**:
4. **Input Sanitization**: Buat centralized input validation dan sanitization
   - Implement schema validation menggunakan Zod
   - Add HTML sanitization untuk mencegah XSS
   - Create validation middleware untuk API routes

**File**: `common/libs/adminAuth.ts`

**Function**: `checkAdminAuth`

**Specific Changes**:
5. **Secure Comparison**: Replace simple comparison dengan constant-time comparison
   - Gunakan `crypto.timingSafeEqual()` untuk token comparison
   - Ensure both strings have same length before comparison
   - Add additional security measures untuk admin authentication

**File**: `components/ErrorBoundary.tsx` (new file)

**Function**: React Error Boundary component

**Specific Changes**:
6. **Error Boundary Implementation**: Buat error boundary component
   - Implement `componentDidCatch` dan `getDerivedStateFromError`
   - Create user-friendly fallback UI
   - Add error reporting untuk monitoring

**File**: `next.config.mjs`

**Function**: Image configuration

**Specific Changes**:
7. **Image Security**: Replace wildcard hostname dengan explicit whitelist
   - Define allowed image domains (Supabase, Cloudinary, etc.)
   - Remove `hostname: "**"` configuration
   - Add only trusted domains untuk image sources

**File**: `common/libs/error-handler.ts` (new file)

**Function**: Centralized error handling

**Specific Changes**:
8. **Centralized Error Handler**: Buat consistent error handling untuk API routes
   - Standardize error response format
   - Prevent sensitive information exposure
   - Add proper logging untuk debugging

**File**: `common/libs/monitoring.ts` (new file)

**Function**: Performance dan error monitoring

**Specific Changes**:
9. **Monitoring Implementation**: Add comprehensive monitoring
   - Integrate dengan Vercel Analytics atau Sentry
   - Track performance metrics dan error rates
   - Implement health check endpoints

## Testing Strategy

### Validation Approach

Testing strategy menggunakan two-phase approach: pertama, surface counterexamples yang mendemonstrasikan bug pada unfixed code, kemudian verify bahwa fix bekerja dengan benar dan preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples yang mendemonstrasikan bug SEBELUM implementing fix. Confirm atau refute root cause analysis. Jika refute, perlu re-hypothesize.

**Test Plan**: Write tests yang simulate security vulnerabilities dan error conditions. Run tests pada UNFIXED code untuk observe failures dan understand root cause.

**Test Cases**:
1. **Environment Variable Test**: Start aplikasi tanpa NEXTAUTH_SECRET (akan fail pada unfixed code)
2. **Rate Limiting Test**: Send 200+ requests dalam 10 menit ke API endpoint (akan fail pada unfixed code)
3. **XSS Input Test**: Send malicious script dalam API request body (akan fail pada unfixed code)
4. **Component Error Test**: Trigger React component error dan verify crash behavior (akan fail pada unfixed code)
5. **Timing Attack Test**: Measure response time untuk admin authentication dengan different tokens (akan fail pada unfixed code)
6. **Image Security Test**: Request image dari malicious domain (may fail pada unfixed code)

**Expected Counterexamples**:
- Aplikasi start dengan predictable secret ketika NEXTAUTH_SECRET missing
- API endpoints accept unlimited requests tanpa rate limiting
- Malicious input tidak di-sanitize dan berpotensi menyebabkan XSS
- Component errors menyebabkan white screen crash
- Admin authentication rentan terhadap timing attacks
- Images dari arbitrary domains dapat di-load

### Fix Checking

**Goal**: Verify bahwa untuk semua inputs dimana bug condition holds, fixed function menghasilkan expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedSystem(input)
  ASSERT expectedSecureBehavior(result)
END FOR
```

### Preservation Checking

**Goal**: Verify bahwa untuk semua inputs dimana bug condition TIDAK hold, fixed function menghasilkan result yang sama dengan original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalSystem(input) = fixedSystem(input)
END FOR
```

**Testing Approach**: Property-based testing direkomendasikan untuk preservation checking karena:
- Generate banyak test cases secara otomatis across input domain
- Catch edge cases yang manual unit tests mungkin miss
- Provide strong guarantees bahwa behavior unchanged untuk semua non-buggy inputs

**Test Plan**: Observe behavior pada UNFIXED code pertama untuk valid inputs, kemudian write property-based tests capturing behavior tersebut.

**Test Cases**:
1. **OAuth Flow Preservation**: Verify Google dan GitHub login continue bekerja dengan same flow
2. **API Response Preservation**: Verify valid API requests return same response format
3. **Admin Operations Preservation**: Verify CRUD operations pada articles/awards/achievements continue bekerja
4. **Content Display Preservation**: Verify portfolio content display unchanged
5. **Internationalization Preservation**: Verify language switching continue bekerja
6. **Database Operations Preservation**: Verify Supabase queries continue bekerja

### Unit Tests

- Test environment variable validation pada startup
- Test rate limiting logic dengan different request patterns
- Test input sanitization dengan various malicious inputs
- Test error boundary component dengan different error types
- Test secure comparison function dengan timing measurements
- Test image domain whitelist validation

### Property-Based Tests

- Generate random valid API requests dan verify response consistency
- Generate random admin operations dan verify authorization behavior unchanged
- Generate random component states dan verify error boundary behavior
- Generate random OAuth flows dan verify authentication success
- Test rate limiting dengan random request patterns within dan outside limits

### Integration Tests

- Test full application startup dengan dan tanpa required environment variables
- Test complete API request flow dengan rate limiting enabled
- Test end-to-end admin authentication dengan secure comparison
- Test image loading dari whitelisted dan non-whitelisted domains
- Test error boundary behavior dalam real component hierarchy
- Test monitoring dan logging integration dengan actual error scenarios