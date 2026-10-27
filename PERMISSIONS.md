# Roles & permissions

Every access rule lives in **one file**: [`src/access/permissions.ts`](src/access/permissions.ts).
Collections and globals never hard-code access; they read that matrix. To change what a role may do,
edit the matrix and restart the server. No other file needs touching.

## The three roles

| Role | Intended for | Fixed rules (not in the matrix) |
| --- | --- | --- |
| **Super admin** | Owner / tech lead | Can do everything, always. Only role that can change anyone's role. |
| **Editor** | Marketing / content lead | Starting proposal below. |
| **Staff** | Front desk, instructors | Starting proposal below. |

Fixed rules that apply regardless of the matrix:

- Every signed-in user can open the admin panel and **read and edit their own account** (name, email, password). They can never change their own role.
- The **first account ever created** (on a fresh database) becomes super admin automatically.
- **Audit logs** can never be created or edited through the admin or API, by anyone. Only the server's hooks write them.
- A user with a missing or unknown role is treated as **staff** (lowest access).

## Current proposal: please decide

`public` means logged-out website visitors too. `✓` = allowed, `—` = not allowed. Super admin is always ✓.

### Collections

| Collection | Action | Editor | Staff | Decide / notes |
| --- | --- | :-: | :-: | --- |
| Courses | read | public | public | Must stay public (website). |
| | create / update / delete | ✓ | — | Should staff be able to update intake dates and prices? |
| Instructors (`staff`) | read | public | public | Must stay public. |
| | create / update / delete | ✓ | — | Should instructors edit their own profile? (needs an owner field) |
| Services | read | public | public | Must stay public. |
| | create / update / delete | ✓ | — | |
| Testimonials | read | public | public | Must stay public. |
| | create / update | ✓ | ✓ | Staff collect quotes from students. |
| | delete | ✓ | — | |
| Gallery | read | public | public | Must stay public. |
| | create / update | ✓ | ✓ | Staff post class photos. |
| | delete | ✓ | — | |
| Media | read | public | public | Must stay public (images). |
| | create / update | ✓ | ✓ | Needed for anyone who adds gallery photos. |
| | delete | ✓ | — | Deleting media breaks pages that use it. |
| Contact submissions | create | public | public | Must stay public (website form). |
| | read / update | ✓ | ✓ | Staff follow up on leads. |
| | delete | ✓ | — | |
| Users | read / create / update / delete **others** | — | — | Own account always allowed (see above). |
| Audit logs | read / delete | — | — | Super admin only. Give editors read access? |

### Globals

| Global | read | Editor update | Staff update | Decide / notes |
| --- | --- | :-: | :-: | --- |
| Home / About / Courses / Team / Services / Gallery / Contact page | public | ✓ | — | |
| Entry popup | public | ✓ | ✓ | Staff run short promotions. |
| Site settings (nav, contact info, theme, SEO) | public | — | — | Super admin only. Editors would usually need contact info; split it out if so. |

## How to change a rule

```ts
// src/access/permissions.ts
courses: { read: 'public', create: EDITORS, update: TEAM, delete: EDITORS },
//                                            ^^^^ now staff can update courses too
```

Building blocks: `EDITORS` (`['editor']`), `TEAM` (`['editor', 'staff']`), `NOBODY` (`[]`, super admin only),
`'public'`, or any custom array such as `['staff']`.

Adding a new role: add it to `ROLES` and `ROLE_LABELS` in the same file, then use it in the rules.
The role dropdown on Users updates automatically.

Field-level exceptions (for example "staff may edit `nextIntake` but nothing else on a course") are not in the
matrix. They go on the field itself as `access: { update: ... }`. Ask for this if you want it.

## Audit log

Every create, update and delete on every collection and global, plus every login, is recorded in
**System → Audit logs** with who, when, which document, and which top-level fields changed.
The same line is printed to the server log as `[audit] ...`. Seed and migration scripts skip auditing.
Implementation: [`src/hooks/audit.ts`](src/hooks/audit.ts).
