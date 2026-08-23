import * as Sentry from "@sentry/cloudflare";

export type ServerErrorContext = Record<
  string,
  string | number | boolean | null
>;

export function reportServerError(
  error: unknown,
  context: ServerErrorContext = {},
) {
  Sentry.withScope((scope) => {
    scope.setContext("lowlife", context);
    Sentry.captureException(error);
  });
}
