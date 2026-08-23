import * as Sentry from "@sentry/react";
import { reportLovableError } from "./lovable-error-reporting";

export type ErrorContext = Record<string, string | number | boolean | null>;

export function initClientObservability() {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  if (!dsn || Sentry.isInitialized()) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
  });
}

export function reportClientError(error: unknown, context: ErrorContext = {}) {
  reportLovableError(error, context);
  Sentry.captureException(error, { contexts: { lowlife: context } });
}

export function addClientBreadcrumb(message: string, data: ErrorContext = {}) {
  Sentry.addBreadcrumb({ category: "storefront", message, data });
}
