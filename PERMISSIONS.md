# Roles & permissions

Roles and permissions are managed **in the admin panel**, not in code. Changes apply on the next request; no restart.

## Three kinds of access

| Who | How it is decided |
| --- | --- |
| **Super admin** (checkbox on the user) | Sees and does everything, always. |
| **Signed-in users** (and API-key accounts) | Their **role** under System → Roles, plus any **permission exceptions** on their account. |
| **Guest** (no sign-in: the website, public API calls) | The built-in **Guest** role under System → Roles. |

For signed-in users, **Read decides whether a collection or page appears in the admin panel at all.**
Create, Update or Delete imply Read. Tick **All** at the start of a row to grant every action in it.

How a request from a signed-in user is decided:

1. **Super admin** → allowed.
2. A **permission exception** on the user for that resource and action → its Allow / Deny.
3. Otherwise → the checkbox on the user's **role**. No role → only their own account.

## Guest role (the website)

The website reads content without signing in, so it runs as **Guest**. It starts with exactly what the
site needs: Read on all content, pages and site settings, and Create on contact submissions (the form).

- Untick Read on something to hide it from the website and the public API. The website then shows its
  built-in fallback for that part.
- Guest can **never** be given anything else (editing content, reading leads, accounts, audit logs), even
  through the API. The role editor only shows the allowed checkboxes.
- News: guests only ever see **published** posts. Signed-in users with Read also see drafts.
- Guest is built in: it cannot be deleted or assigned to a person. Saving it refreshes the website cache.

## API keys

Every user account can **Enable API key** (on the account page). Requests sent with the header
`Authorization: users API-Key <key>` act as that account, with exactly its role and exceptions.
For an integration (partner site, app), create a dedicated user such as "Partner app", give it a role
with only what it needs, and use its key.

## Fixed rules (cannot be changed from the admin)

- **Only super admins** can manage roles or change anyone's role, super admin checkbox or exceptions,
  so nobody can grant themselves more access.
- People with Users access can manage other accounts, but **never a super admin's**. Note that Users → Update
  lets someone reset another (non-super-admin) account's password or API key, so only give it to trusted roles.
- Every signed-in user can open the admin panel and **read and edit their own account**.
- A super admin **cannot remove their own** super admin checkbox; another super admin has to.
- A role that is **still assigned to users cannot be deleted**.
- **Audit logs** are only written by the server; nobody can create or edit them.
- The **first account** on a fresh database becomes super admin automatically.

## Startup sync

[`src/access/syncRoles.ts`](src/access/syncRoles.ts) runs on every start and is safe to repeat. It:

- creates the **Guest** role if missing;
- creates **Editor** and **Staff** on a database with no other roles;
- upgrades roles saved before Read existed by turning Read on for all website content and pages, which
  every signed-in user could already see, so nobody loses access;
- converts users on the old text roles: `super-admin` → Super admin checkbox, `editor` / `staff` → the
  matching role, anything else → Staff.

## For developers

- Which actions exist for each resource, and which Guest may have: [`src/access/permissions.ts`](src/access/permissions.ts).
  Adding a new collection or global: add it there, then use `collectionAccess(slug)` / `globalAccess(slug)` in its
  config. The role editor and the exception dropdown pick it up automatically.
- The checks: `can(req, resource, action)` (any request, including Guest) and `userCan(user, ...)` in
  [`src/access/index.ts`](src/access/index.ts). The Guest role is loaded once per request.
- Users has `auth.depth: 1`, so the role is loaded with the signed-in user on every request.
- Field-level rules (for example "staff may edit `nextIntake` but nothing else on a course") are not covered;
  they go on the field itself as `access: { update: ... }`.

## Audit log

Every create, update and delete on every collection and global, plus every login, is recorded in
**System → Audit logs** with who, when, which document, and which top-level fields changed.
The same line is printed to the server log as `[audit] ...`. Seed and migration scripts skip auditing.
Implementation: [`src/hooks/audit.ts`](src/hooks/audit.ts).
