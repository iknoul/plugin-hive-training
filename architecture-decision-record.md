# ADR 1 - (ACCEPTED): Why PostgreSQL for Sellers and Pickup Addresses

* **Context: Seller accounts and pickup hubs are structured master data that require strong consistency and clear ownership rules.
* Decision: Store `sellers` and `pickup_addresses` in PostgreSQL using normalized relational tables (`seller_id` as a foreign key in `pickup_addresses`).
* REASONS:
  * Strict relational integrity (1:N) between sellers and their multiple pickup addresses, enforced via foreign keys.
  * ACID-compliant updates ensure seller profiles and active/default pickup hubs flags stay consistent without orphaned records.
* COSTS:
  * Operational complexity: Maintaining two database engines (PostgreSQL + MongoDB), handling seperate db clients.
  * No native cross-database joins: Overhead for fetching and syncing data.

---

# ADR 2 - (REJECTED): Why PostgreSQL for Sellers and Pickup Addresses

* **Context: Seller accounts and pickup hubs are structured master data that require strong consistency and clear ownership rules.
* Decision: Keep Store `sellers` and `pickup_addresses` in Mongodb using normalized collections.
* REASONS:
  *  Using a single relational database would eliminate cross-database ID references
  *  Operational simplicity: Maintaining two database engines (PostgreSQL + MongoDB), handling seperate db clients are costly.
* COSTS:
  * No database constrained relational integrity,MongoDB lacks native foreign key constraints, (1:N) between sellers and their multiple pickup addresses, enforced via foreign keys.
  * Multi-document transaction complexity:** Updating a seller's profile alongside their active or default pickup hubs across separate collections requires multi-document ACID transactions instead of native relational constraints.

---



