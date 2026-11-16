"use client";

import { createAuthClient } from "@neon/auth/next";

// Talks to this site's own /api/auth routes, which forward to Neon.
export const authClient = createAuthClient();
