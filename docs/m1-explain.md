# M1: What state lives in the store and what stays inside a component? Why?

The store holds state that more than one page (or the header or router guard) needs and that must survive navigation: the logged-in user, the cart, the product list and the orders, each with its `status` and `error`. A component keeps state that only it uses and that should disappear when the user leaves: form fields, the `submitted` and `pending` flags, server error text for one form, and the search box / category filter. If the cart were inside `ProductDetailPage`, the header badge and the cart page could not see it; if the search text were in a store, it would stay stuck when the user comes back to the shop. Anything that can be calculated from other state (`visible`, `unitPrice`, `cart.total`) is a `computed`, never a second copy of the data.

## Where each field is validated
In `src/validation.ts` on the client, for fast, clear messages under each field. This is only for user experience: the NestJS server must validate everything again in week 7, because anyone can send a request without the form.
