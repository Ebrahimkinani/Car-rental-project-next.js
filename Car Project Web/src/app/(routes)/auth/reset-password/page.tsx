/**
 * Reset Password Page
 * Allows users to reset their password using a token from email
 */

import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}

