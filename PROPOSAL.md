# Internet Programming: Project Proposal (Handmade Flower Shop web application)

Lecturer: Mr. CHUN Thavorac · Name: Sao Dali Inaco · ID: p20240003
Repository: https://github.com/SaoDaliInaco/IP-Project-p20240003

## 1. Problem statement
In many local Cambodian markets, artisanal handmade flower shops rely on walk-in visits or informal chat orders, which creates long queues and poor coordination. Customers cannot easily customise orders or schedule delivery/pickup, and owners struggle at peak hours.

## 2. Target users and roles
- **Customer:** browses the catalog, checks bouquet details, customises bouquets (add-ons, cards), chooses a pickup or delivery slot, places orders and follows their status.
- **Shop Admin:** manages catalog items, updates inventory status, reviews incoming orders, updates order status and oversees daily schedules.

## 3. User stories
1. **Registration & login:** Argon2-hashed passwords, client-side validation and server 400 errors, JWT for protected routes.
2. **Product browsing & details:** public `GET /products` returns active items; detail shows materials and customisation options.
3. **Catalog management (Admin):** only ADMIN can `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`; changes show immediately in the store.
4. **Custom bouquet order:** choose wrapping, ribbon and card, price calculated dynamically, choose PICKUP or DELIVERY and a schedule; an Order and OrderItems are created with status PENDING.
5. **Admin order status:** `/admin/orders` lists active orders sorted by scheduled time; admin moves PENDING to PREPARING or READY; customers get 403.
6. **Order history & tracking:** `GET /orders/my-orders` returns only the caller's orders (ownership check).
7. **(Nice to have) Handwritten card notes:** `customNote` on OrderItem, max 250 characters with a live counter, visible to customer and admin.

## 4. MVP scope
1. Authentication (register, login, JWT, role-based route guards)
2. Product catalog with details and category browsing
3. Cart and order creation (items, pickup/delivery scheduling)
4. Customer order history with strict ownership authorization
5. Admin dashboard: catalog CRUD and order status updates

## 5. Data model
See [docs/erd.md](docs/erd.md).

## 6. Stretch feature
**Scheduled task:** a daily NestJS cron job (Prisma on PostgreSQL) marks PENDING orders older than 24 hours as CANCELLED.

## 7. MVP cut
Cut: **In-App Live Chat**. It needs WebSockets for instant messaging, which is too complex for the timeline; cutting it keeps the focus on authentication, products and ordering.
