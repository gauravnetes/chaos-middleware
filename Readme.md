Chaos Middleware 🌪️
A simple yet powerful Node.js middleware for Express and Next.js that intentionally introduces chaos (latency and errors) into your API routes during development. Force yourself to build more resilient, user-friendly frontend applications.

The Problem
When developing on localhost, our applications live in a perfect world with near-zero latency and 100% server reliability. This often leads to a "World Peace" that isn't prepared for the real world's unpredictable network conditions. In Result, UIs that feel frozen on slow connections or break completely when an API call fails.

Chaos Middleware solves this by making your development environment more closely resemble the real world's imperfection.

Core Features
- Latency Injection: Simulate slow network connections with fixed or variable delays.

- Customizable Error Injection: Randomly return specific HTTP errors (like 401 or 429) to test all your UI's error states.

- Smarter Targeting: Apply chaos only to specific HTTP methods like POST or DELETE.

- On-Demand Activation: Toggle chaos on and off with a simple URL query parameter—no server restarts needed!

- Framework-Agnostic: Works seamlessly with Express, Next.js, and other compatible frameworks.

- Production-Safe: Automatically disables itself when NODE_ENV is set to 'production'.

- Zero Dependencies: A lightweight tool that adds no bloat to your project.

Installation
```

npm install @gauravnetes/chaos-middleware

```

Quick Start & Usage
Using the middleware is as simple as adding it to your application or a specific router.

With Express.js

```javascript
// server.js
import express from 'express';
import { chaosMiddleware } from '@gauravnetes/chaos-middleware';

const app = express();

// Apply chaos to ALL routes with 20% error rate and 0.5-1.5s latency
app.use(chaosMiddleware({
  latency: [500, 1500],
  errorRate: 0.2
}));

app.get('/api/user', (req, res) => {
  res.json({ name: 'John Doe', status: 'Fetched successfully!' });
});

app.listen(3001, () => console.log('Server is running...'));
```


With Next.js API Routes
You can apply chaos to a single API route by exporting a custom config with the middleware.

```typescript
// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { chaosMiddleware } from '@gauravnetes/chaos-middleware';

// This is a helper to run middleware in Next.js
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Apply chaos just to this route
  await runMiddleware(req, res, chaosMiddleware({
    latency: [300, 1000],
    errorRate: 0.5 // 50% chance of failure!
  }));

  // Your actual API logic runs after the chaos
  res.status(200).json({ name: 'Jane Doe' });
};

export default handler;
```


Advanced Usage & Configuration
Target specific scenarios by providing a configuration object to chaosMiddleware.


1. Toggle Chaos On-Demand
Avoid restarting your server. Use activationKeyword to turn chaos on and off from your browser.

```javascript
// Apply to all routes, but only when activated
app.use('/', chaosMiddleware({
  latency: [1000, 3000],
  activationKeyword: 'chaos' // Use a short keyword you like!
}));
```

- Chaos OFF: http://localhost:3000/api/data
- Chaos ON: http://localhost:3000/api/data?chaos=true



2. Target Specific HTTP Methods
Test form submissions or deletions without slowing down GET requests.

```javascript
app.use('/api/posts', chaosMiddleware({
  latency: [800, 1500],
  // Only apply chaos to POST and DELETE requests on this route
  methods: ['POST', 'DELETE']
}));
```



3. Simulate Specific API Errors
Test how your UI handles different error types, like an expired token (401) or a server overload (503).

```javascript
app.use('/api/profile', chaosMiddleware({
  errorRate: 0.5, // Fail 50% of the time
  error: {
    status: 401,
    body: { message: 'Your session has expired. Please log in again.' }
  }
}));
```



Configuration Options
You can pass a configuration object to chaosMiddleware to control its behavior.

| Option              | Type                         | Default     | Description                                                                                              |
|---------------------|------------------------------|-------------|----------------------------------------------------------------------------------------------------------|
| `latency`           | `number` \| `[min, max]`     | `undefined` | The delay in ms. Provide a number for a fixed delay or a `[min, max]` tuple for a variable one.            |
| `errorRate`         | `number`                     | `0`         | A number between `0` (never fails) and `1` (always fails) for the probability of an error.               |
| `methods`           | `string[]`                   | `undefined` | Array of HTTP methods (`'GET'`, `'POST'`) to apply chaos to. If omitted, applies to all methods.         |
| `error`             | `{ status, body }`           | `undefined` | A custom error object with a `status` (number) and optional `body` (JSON object). Defaults to `500`.      |
| `activationKeyword` | `string`                     | `undefined` | If provided, chaos only runs when a URL query parameter of this name is set to `'true'`.                 |

A number between 0 (never fails) and 1 (always fails) representing the probability of an error.



License
This project is licensed under the MIT License. See the LICENSE file for details.

Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
