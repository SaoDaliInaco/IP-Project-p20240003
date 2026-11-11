# Component tree and state ownership (M1)

Props go down, events go up. A page owns the state that only it needs; a Pinia store owns state that several pages or the header share.

```
App
├─ AppHeader                 reads: session store (user, isAdmin), cart store (count)
├─ <RouterView>
│  ├─ HomePage               uses: products store          → AsyncState → ProductCard ×4
│  ├─ ProductsPage           uses: products store, useProductFilters (search, category)
│  │                         → AsyncState → ProductCard ×N
│  ├─ ProductDetailPage      prop: id (route param)  · local: form, submitted
│  │                         store: products (byId), cart (add)
│  ├─ LoginPage              local: mode, form, submitted, pending, serverError · store: session
│  ├─ CartPage               local: checkout form, submitted, pending · stores: cart, orders, session
│  ├─ MyOrdersPage           store: orders, products → AsyncState → OrderCard ×N
│  ├─ AdminOrdersPage        store: orders, products → AsyncState → OrderCard ×N (+ status button via slot)
│  └─ NotFoundPage
```

| Component | Props | Events | Owns |
|---|---|---|---|
| `AsyncState` | `status`, `error`, `isEmpty`, `emptyText?`, `skeleton?`, `skeletonRows?` | `retry` | one local flag, `slow` (true after 250 ms of loading); renders loading / error / empty / default slot |
| `LoadingState` | `variant?` (`cards`, `list`, `none`), `rows?` | – | nothing (loading page: message plus placeholder cards, shown only when the network is slow) |
| `ProductCard` | `product` | – (it is a `RouterLink`) | nothing |
| `OrderCard` | `order`, `nameOf` | – | nothing (slot for admin actions) |
| `AppHeader` | – | – | nothing (reads stores) |

## State: store or component?

| State | Where | Why |
|---|---|---|
| `session.user` | Pinia | Header, router guard and several pages need it; must survive navigation |
| `cart.lines` | Pinia | Header badge, detail page (adds) and cart page (reads/edits) share it |
| `products.items/status/error` | Pinia | Home, shop, detail and orders pages all show products; avoids refetching |
| `orders.orders/status/error` | Pinia | Shared by customer and admin pages; admin status change updates the list |
| form fields, `submitted`, `pending`, `serverError` | component | Only that form uses them; thrown away on leaving the page |
| `search`, `category` | component (composable) | UI filter of one page; derived `visible` is a `computed` |
