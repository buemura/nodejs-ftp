-- Disable foreign key checks (PostgreSQL specific)
SET session_replication_role = 'replica';

-- Truncate all tables
TRUNCATE TABLE 
    audit_logs,
    categories,
    coupons,
    error_logs,
    favorites,
    newsletters,
    notifications,
    order_items,
    orders,
    page_views,
    payments,
    product_images,
    product_reviews,
    product_tags,
    products,
    referral_programs,
    roles,
    search_queries,
    shipping_addresses,
    subscribers,
    support_tickets,
    ticket_messages,
    user_roles,
    users,
    wishlist_items,
    wishlists
RESTART IDENTITY CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';
