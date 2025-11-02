/**
 * Login Page
 * User authentication login form
 */

import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login…</div>}>
      <LoginClient />
    </Suspense>
  );
}

