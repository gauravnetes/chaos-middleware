Chaos Middleware 🌪️
A simple yet powerful Node.js middleware for Express and Next.js that intentionally introduces chaos (latency and errors) into your API routes during development. Force yourself to build more resilient, user-friendly frontend applications.

The Problem
When developing on localhost, our applications live in a perfect world with near-zero latency and 100% server reliability. This often leads to a "World Peace" that isn't prepared for the real world's unpredictable network conditions. In Result, UIs that feel frozen on slow connections or break completely when an API call fails.

Chaos Middleware solves this by making your development environment more closely resemble the real world's imperfection.

Core Features
- Latency Injection: Simulate slow network connections with fixed or variable delays.

- Error Injection: Randomly return 500 errors to test your frontend's error-handling logic.

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
  res.json({ name: 'Alex Doe', status: 'Fetched successfully!' });
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
```

```typescript
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

Configuration Options
You can pass a configuration object to chaosMiddleware to control its behavior.

| Option      | Type                      | Default     | Description                                                                                             |
|-------------|---------------------------|-------------|---------------------------------------------------------------------------------------------------------|
| `latency`   | `number` \| `[min, max]`  | `undefined` | The delay to add. Provide a single number for a fixed delay, or a `[min, max]` tuple for a variable one. |
| `errorRate` | `number`                  | `0`         | A number between `0` (never fails) and `1` (always fails) representing the probability of an error.         |

A number between 0 (never fails) and 1 (always fails) representing the probability of an error.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
