### Conceptual Exercise

Answer the following questions below:

- What is a JWT?

A JSON Web Token (JWT) is a compact, URL‑safe string that conveys claims between two parties. It has three base64url‑encoded parts: header, payload, and signature. The payload carries claims (like a user’s username and whether they’re an admin). The signature proves the token was issued by your server and hasn’t been altered.

- What is the signature portion of the JWT?  What does it do?

It’s a MAC (message authentication code) computed from header+payload with a secret (for HS256/HS512) or a private key (for RS/ES algorithms). When a server verifies a token, it recomputes the signature and compares. If they match, the token is authentic and unmodified. If they don’t, the token is rejected.

- If a JWT is intercepted, can the attacker see what's inside the payload?

Yes—unless you separately encrypt it. Standard JWTs are just base64url‑encoded, not encrypted. Never put secrets (passwords, API keys) in the payload. Use HTTPS to prevent interception and keep payloads minimal.

- How can you implement authentication with a JWT?  Describe how it works at a high level.

1) User logs in with username/password to an auth endpoint.  
2) If valid, the server issues a JWT (claims like { username, admin }, optional exp).  
3) The client stores the token (usually in memory) and sends it on each request (Authorization: Bearer <token> or a body field like _token for legacy exercises).  
4) Middleware verifies the JWT signature, pulls claims to req.curr_username / req.curr_admin, and authorizes routes.  
5) On logout, the client discards the token; optionally implement expiry/rotation/blacklist on the server.

- Compare and contrast unit, integration and end-to-end tests.

• Unit tests check one small unit (a function/class) in isolation with dependencies stubbed/mocked. Fast and specific.  
• Integration tests check how units work together (e.g., route handler + DB), catching interface/contract issues.  
• End‑to‑end (E2E) tests exercise the full system as a user would (browser/UI → API → DB). Highest confidence but slowest and most brittle. A good test pyramid has many unit, fewer integration, and the fewest E2E tests.

- What is a mock? What are some things you would mock?

A mock is a fake stand-in for a real dependency used in tests so you can isolate the unit under test. external APIs like http clients, databases and ORMs, filesystems and enviroment.configs are some of the things you can mock.

- What is continuous integration?

CI is the practice of automatically building, testing, and analyzing your code on every push/PR. Typical pipeline: checkout -> install deps -> lint/type-check -> tests -> artifact/report.

- What is an environment variable and what are they used for?

An environment variable is a key–value set outside your code (e.g., OS/process) used to configure behavior per environment. API Keys, database URLs, ports are some of the common uses.

- What is TDD? What are some benefits and drawbacks?

TDD = write a failing test (red), implement code to pass (green), then refactor while tests stay green.
Benefits: clearer design, confidence/regression safety, better test coverage, more refactor-friendly code.
Drawbacks: upfront time cost, not ideal for exploratory/prototype work, UI/integration heavy areas can be cumbersome to test first.

- What is the value of using JSONSchema for validation?

values of JSON Schemas are: single source of truth, reusable across services, better error messages, enables tooling (validation, docs, codegen), guards APIs against bad input. Drawbacks: can be verbose; learning curve.

- What are some ways to decide which code to test?

We can prioritize business-critical logic and security sensitive paths, complex/bug-prone codes, boundary conditions

- What does `RETURNING` do in SQL? When would you use it?

In PostgreSQL, RETURNING makes INSERT/UPDATE/DELETE return rows affected.
Use it to get generated IDs or updated fields without a second SELECT, and to confirm that an operation actually touched a row.

- What are some differences between Web Sockets and HTTP?

HTTP: request -> response, stateless, one-off connections, great for REST, caching, proxies/CDNs.

WebSockets: persistent, bidirectional channel over a single TCP connection; low overhead after upgrade. Ideal for real-time (chat, live dashboards, games).

- Did you prefer using Flask over Express? Why or why not (there is no right
  answer here --- we want to see how you think about technology)?

  uhmmm i was liking Flask and SQLAlchemy initially but Express and the npm ecosystem is growing on me!
