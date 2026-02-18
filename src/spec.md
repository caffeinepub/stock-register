# Specification

## Summary
**Goal:** Add an Internet Identity login screen and require authentication before accessing the Stock Register app, with logout support and backend write protection.

**Planned changes:**
- Create a full-page Login screen with a primary “Sign in with Internet Identity” action using the existing authentication hook, plus loading and error states.
- Update top-level app rendering to show the Login screen when no identity is present and show the existing Stock Register page after successful authentication (including auto-transition and session persistence on reload).
- Add a visible “Logout” control in the authenticated UI that clears the Internet Identity session and returns to the Login screen.
- Restrict backend write methods (add/update/remove) to authenticated callers by rejecting anonymous principals; keep query methods callable.

**User-visible outcome:** Users must sign in with Internet Identity to use the Stock Register UI; authenticated users can log out, and anonymous users cannot perform backend write operations.
