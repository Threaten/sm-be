# Roles & permissions

Roles and permissions are managed **in the admin panel**, not in code. Changes apply on the next request; no restart.

- **System → Roles**: create a role, then tick Create / Read / Update / Delete for each content type and page.
- **System → Users**: give each person a role, tick **Super admin**, or add **Permission exceptions**
  (allow or deny one action for that person only, overriding their role).

How a request is decided:

1. **Super admin** → allowed, always.
2. A **permission exception** on the user for that resource and action → its Allow / Deny.
3. Otherwise → the checkbox on the user's **role**. No role → nothing beyond the fixed rules below.

## Fixed rules (cannot be changed from the admin)

- Website content (courses, instructors, services, news, testimonials, gallery, media, all pages and site settings)
  is **always publicly readable**, so the website keeps working. That is why those resources have no Read checkbox.
  News is the exception: its Read means "see unpublished drafts"; published posts stay public.
- **Anyone can create a contact submission** (the website form).
- **Audit logs** are only written by the server; nobody can create or edit them.
- Every signed-in user can open the admin panel and **read and edit their own account**.
- **Only super admins** can manage roles or change anyone's role, super admin checkbox or exceptions,
  so nobody can grant themselves more access.
- People with Users access can manage other accounts, but **never a super admin's** (they could otherwise
  reset its password).
- A super admin **cannot remove their own** super admin checkbox; another super admin has to.
- A role that is **still assigned to users cannot be deleted**.
- The **first account** on a fresh database becomes super admin automatically.

## Starting roles

On a database with no roles, the server creates **Editor** and **Staff** with the rules that used to be hard-coded
(Editor: all website content, leads and pages except site settings; Staff: testimonials, gallery, media, leads,
news drafts and the entry popup). Users on the old text roles are converted on startup:
`super-admin` → Super admin checkbox, `editor` / `staff` → the matching role, anything else → Staff.
See [`src/access/syncRoles.ts`](src/access/syncRoles.ts). It runs on every start and is safe to repeat.

## For developers

- Which actions exist for each resource: [`src/access/permissions.ts`](src/access/permissions.ts).
  Adding a new collection or global: add it there, then use `collectionAccess(slug)` / `globalAccess(slug)` in its
  config. The role editor and the exception dropdown pick it up automatically.
- The check itself: `can(user, resource, action)` in [`src/access/index.ts`](src/access/index.ts).
- Users has `auth.depth: 1`, so the role (with its checkboxes) is loaded with the signed-in user on every request.
- Field-level exceptions (for example "staff may edit `nextIntake` but nothing else on a course") are not covered;
  they go on the field itself as `access: { update: ... }`.

## Audit log

Every create, update and delete on every collection and global, plus every login, is recorded in
**System → Audit logs** with who, when, which document, and which top-level fields changed.
The same line is printed to the server log as `[audit] ...`. Seed and migration scripts skip auditing.
Implementation: [`src/hooks/audit.ts`](src/hooks/audit.ts).
