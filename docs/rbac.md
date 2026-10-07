# RBAC (Role-Based Access Control) for the Blood Donation Registry

## What is RBAC?

Each user gets **one role**; each role has a fixed list of **permissions**. The code checks permissions, not
individual users. To change what Staff can do, you change the role's list once instead of editing every user.

## Proposed roles

| Role      | Who                                    | How they get it                                         |
| --------- | -------------------------------------- | ------------------------------------------------------- |
| **ADMIN** | Blood bank manager / system admin      | Created by another admin or seeded in the database      |
| **STAFF** | Nurse / desk staff recording donations | Created by an admin                                     |
| **DONOR** | A person who donates blood             | Self-registration (the Register page); **always** DONOR |

Self-registration never lets the user pick a role. The frontend doesn't send one and the backend ignores it if
one is sent; otherwise anyone could register as ADMIN.

## Permission matrix

| Permission                          | ADMIN | STAFF |      DONOR       |
| ----------------------------------- | :---: | :---: | :--------------: |
| View all donors / search / paginate |  ✅   |  ✅   |        ❌        |
| Create donor                        |  ✅   |  ✅   |        ❌        |
| Update donor                        |  ✅   |  ✅   | Own profile only |
| Delete donor                        |  ✅   |  ❌   |        ❌        |
| View all donations                  |  ✅   |  ✅   |        ❌        |
| View `/donors/:id/donations`        |  ✅   |  ✅   |   Own id only    |
| Record donation (90-day check runs) |  ✅   |  ✅   |        ❌        |
| Update donation                     |  ✅   |  ✅   |        ❌        |
| Delete donation                     |  ✅   |  ❌   |        ❌        |
| Manage staff accounts               |  ✅   |  ❌   |        ❌        |

Deletes are ADMIN-only because they destroy medical history. The UI also asks for confirmation first.

## Where RBAC is implemented

### 1. Backend (Spring Boot): the real security gate

Everything here is enforced. If the backend doesn't check it, it isn't protected.

| Layer                       | What to do                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Database                    | `users.role` column (enum `ADMIN`, `STAFF`, `DONOR`); donor row linked to its user        |
| Login / token               | Put the role in the access token (JWT claim `role`) and in the login response `user.role` |
| URL rules                   | `SecurityFilterChain`: e.g. `DELETE /api/donors/**` → `hasRole('ADMIN')`                  |
| Method rules                | `@PreAuthorize("hasAnyRole('ADMIN','STAFF')")` on service/controller methods              |
| Ownership ("own data only") | In the service: if role is DONOR, check `donor.userId == currentUser.id`, else 403        |
| Errors                      | 401 = not logged in / token expired, 403 = logged in but not allowed                      |
| Audit                       | Log who created/updated/deleted what and when (banking requirement)                       |

Example (illustration for later, not part of this frontend task):

```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
    .requestMatchers("/api/donors/**", "/api/donations/**").hasAnyRole("ADMIN", "STAFF", "DONOR")
    .anyRequest().authenticated());

@PreAuthorize("hasRole('ADMIN') or @donorSecurity.isOwner(#donorId)")
public List<DonationDto> getDonationsForDonor(Long donorId) { ... }
```

### 2. Frontend (React): user experience only

Hiding a button only means the user doesn't see it. They can still call the API directly, so the backend
must check every rule.

| Where                                                                       | Status   | What it does                                                                                                                |
| --------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/constants/roles.js`                                                    | ✅ Added | `ROLES`, `ROLE_LABELS`, `PERMISSIONS`, `ROLE_PERMISSIONS`                                                                   |
| `src/utils/hasPermission.js`                                                | ✅ Added | `hasPermission(user, PERMISSIONS.DONOR_DELETE)` → show/hide buttons                                                         |
| `src/features/auth/ProtectedRoute.jsx` / `RoleRoute.jsx` / `GuestRoute.jsx` | ✅ Added | Login required / role required (403 page) / logged-in users kept away from Login                                            |
| `src/components/layout/Header.jsx`                                          | ✅ Added | Shows the role as text next to the user's name                                                                              |
| `src/pages/DonorListPage.jsx` + `Sidebar.jsx`                               | ✅ Added | Donors route is ADMIN/STAFF only; Delete button ADMIN only; sidebar items filtered by `ROUTE_ROLES`; `/users` is ADMIN only |
| `apiClient.js` 403 handling                                                 | ✅ Added | Shows "You do not have permission…" when the backend refuses                                                                |

Example of how future code will use it:

```jsx
// App.jsx: only Admin and Staff can open the donor list page.
<Route
  path={ROUTES.DONORS}
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
      <DonorListPage />
    </ProtectedRoute>
  }
/>;

// DonorRow.jsx: hiding the button is UX, NOT security; the API enforces this rule.
function DonorRow({ donor }) {
  const { user } = useAuth();
  const canDelete = hasPermission(user, PERMISSIONS.DONOR_DELETE);
  return (
    <li>
      {donor.name} {canDelete && <Button onClick={confirmDelete}>Delete</Button>}
    </li>
  );
}
```

## "Owner" rule

Some apps let a record's owner edit or delete it. Here a donor record isn't linked to a login account yet
(staff enter donors), so donor CRUD uses role permissions only: ADMIN/STAFF create and edit, ADMIN deletes. When
donors get accounts, the backend can add an ownership check (`donor.userId == currentUser.id`), and
`useDonorPermissions` can then allow DONOR users to edit their own profile.

## Open questions for the team

1. Should a DONOR be able to log in at all in phase 1, or is the app staff-only for now?
2. Can STAFF edit a donation after it's recorded, or only ADMIN (stricter audit)?
3. Should the backend send the permission list in the login response instead of the frontend copying
   `ROLE_PERMISSIONS`? That avoids the two lists drifting apart.
