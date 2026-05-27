# InfinityFy - Project Structure

> Self-contained guide for developers and AI assistants working with this codebase.

## Tech Stack

Next.js 14+ (App Router), TypeScript, Tailwind CSS, TanStack React Query, Zod, Lucide React.

---

## Directory Map

| Path | What it is |
|---|---|
| `src/app/(auth)/` | Public auth pages: login, forgot-password, first-access, verify-code, new-password |
| `src/app/(protected)/` | All authenticated pages (see feature routes below) |
| `src/components/` | Shared components: PageHeader, PageHeaderGroup, Breadcrumb, Filter, Pagination, PermissionGuard, ErrorState, LoadingState, etc. |
| `src/components/ui/` | Design-system primitives: Button, Card, Input, Select, Table, Tabs, Modal, InfoField, InputsGrid, Tip |
| `src/core/api/` | HTTP client (`api` singleton wrapping fetch), interceptors, error classes |
| `src/core/hooks/` | App-wide hooks: `useAuth`, `useToast`, `useCSVDownload`, `usePersistedFilters` |
| `src/core/providers/` | `AppProvider` (wraps React Query + Auth + Toaster), `AuthProvider` |
| `src/core/services/` | `auth.service` (login, tokens), `storage.service` (localStorage) |
| `src/core/config/` | `env.ts` — environment variables |
| `src/core/utils/` | `formatters.ts`, `csv.ts` |
| `src/shared/types/` | All shared TypeScript types: user, permission, clinic, pagination, auth, etc. |
| `src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |

---

## Protected Routes

### Auth Flow

1. `(protected)/layout.tsx` checks `useAuth()` → redirects to `/login` if unauthenticated.
2. `DashboardShell` renders the sidebar + navbar + main content area.
3. Sidebar links are filtered by user permissions (defined in `sidebar-config.ts`).

### Shared Protected Infrastructure

| File | Purpose |
|---|---|
| `_components/DashboardShell.tsx` | Layout shell: sidebar + navbar + main |
| `_components/Sidebar.tsx` | Collapsible sidebar, icon-only on collapse, hidden on mobile |
| `_components/Navbar.tsx` | Top bar: search, notifications, avatar, mobile menu |
| `_components/sidebar-config.ts` | Nav links with `permissions: Permission[] | null` (null = all users) |
| `_hooks/useSidebarState.ts` | Sidebar open/close state |
| `_hooks/useNotifications.ts` | Notification data |
| `_services/notification.service.ts` | Notification API |

### Current Feature Routes

| Route | URL | Sub-routes |
|---|---|---|
| `dashboard/` | `/dashboard` | — |
| `usuarios/` | `/usuarios` | `[id]/`, `new/` |
| `perfis/` | `/perfis` | `[id]/`, `new/` |
| `perfil/` | `/perfil` | — |
| `logs/` | `/logs` | — |
| `notificacoes/` | `/notificacoes` | — |

Each feature route can contain: `_components/`, `_hooks/`, `_services/`, `_schemas/`, `_utils/`.

---

## Conventions

### Naming

- **Components:** PascalCase — `UserTable.tsx`
- **Hooks:** camelCase + `use` prefix — `useUsers.ts`
- **Services:** camelCase + `.service` suffix — `user.service.ts`
- **Schemas:** camelCase + `.schema` suffix — `user.schema.ts`
- **Types:** camelCase — `user.ts`

### Folders

- `_components/`, `_hooks/`, `_services/`, `_schemas/`, `_utils/` — route-scoped (underscore = private, not a URL segment)
- `[param]/` — dynamic route
- `(group)/` — route group (not in URL)

### Imports

- Use `@/` alias for anything outside the current feature (e.g. `@/components/ui/Button`, `@/core/hooks/useAuth`)
- Use relative imports for co-located code within a feature (e.g. `./_components/MyList`)

---

## Key Patterns

### Page Structure

Every page follows this structure:
1. Wrap with `PermissionGuard` (pass required `Permission` enum values)
2. Use `PageHeaderGroup` to pair `PageHeader` with an action button (create/edit)
3. Add `Breadcrumb` on detail/edit/create pages
4. Add `Filter` on list pages
5. Render the data component (list, detail, form)

**Important:** Action buttons (create, edit) live in `page.tsx` inside `PageHeaderGroup`. Data-display components only render data — they don't own navigation actions.

`PageHeaderGroup` is responsive: stacks children vertically on mobile, horizontal on desktop.

### Feature Folder Structure

```
my-feature/
├── page.tsx              # List page
├── new/page.tsx          # Create page
├── [id]/page.tsx         # Detail page
├── [id]/edit/page.tsx    # Edit page
├── _components/          # Route-scoped components
├── _hooks/               # Route-scoped hooks (useQuery/useMutation wrappers)
├── _services/            # Route-scoped API service object
├── _schemas/             # Route-scoped Zod schemas
└── _utils/               # Route-scoped helpers
```

### Data Flow

- **Service** (`_services/`) → object with methods calling `api.get/post/put/delete`
- **Hook** (`_hooks/`) → wraps service with `useQuery` or `useMutation` from React Query
- **Component** (`_components/`) → calls hook, renders UI
- **Page** (`page.tsx`) → composes PermissionGuard + PageHeaderGroup + components

### Sidebar

To add a new page to the sidebar, add an entry to `sidebarUpperLinks` or `sidebarLowerLinks` in `sidebar-config.ts` with `label`, `href`, `permissions` (array of `Permission` enums or `null` for all users), and `icon` (Lucide icon).

---

## Principles

1. **Co-location** — Route-specific code lives in `_` folders next to the page
2. **Feature-based** — Group by route, not by file type
3. **Page owns layout** — Action buttons and headers stay in `page.tsx`
4. **Permission-based access** — `PermissionGuard` in pages, `permissions` in sidebar config
5. **Type safety** — Shared types in `shared/types/`, form validation with Zod
6. **URL-driven filters** — `Filter` component syncs state with URL search params
7. **React Query** — All server state via `useQuery`/`useMutation` wrapping service objects

---

## Quick Reference

| Need to... | Look at... |
|---|---|
| See a list page example | `src/app/(protected)/perfis/page.tsx` |
| See a detail page example | `src/app/(protected)/perfis/[id]/page.tsx` |
| Add API calls | Any `_services/` + `_hooks/` folder (e.g. `perfis/_services/`) |
| Add form validation | Any `_schemas/` folder |
| Understand permissions | `src/shared/types/permission.ts` |
| Change sidebar nav | `src/app/(protected)/_components/sidebar-config.ts` |
| Understand auth | `src/core/providers/AuthProvider.tsx` → `core/hooks/useAuth.ts` |
| HTTP client config | `src/core/api/http.ts` + `interceptors/` |
| Shared components | `src/components/` |
| Design-system primitives | `src/components/ui/` |
