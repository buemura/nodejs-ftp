CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(255),
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50)
);

CREATE TABLE user_roles (
    user_role_id SERIAL PRIMARY KEY,
    user_id INT,
    role_id INT
);

-- Products and Inventory
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100),
    parent_category_id INT
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    category_id INT,
    stock_quantity INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INT,
    image_url TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INT,
    user_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_tags (
    product_tag_id SERIAL PRIMARY KEY,
    product_id INT,
    tag_name VARCHAR(50)
);

-- Orders and Transactions
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT,
    order_status VARCHAR(50),
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10, 2)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shipping_addresses (
    shipping_address_id SERIAL PRIMARY KEY,
    order_id INT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20)
);

-- Customer Support
CREATE TABLE support_tickets (
    ticket_id SERIAL PRIMARY KEY,
    user_id INT,
    subject VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE ticket_messages (
    message_id SERIAL PRIMARY KEY,
    ticket_id INT,
    sender_id INT,
    message_text TEXT,
    sent_at TIMESTAMP DEFAULT NOW()
);

-- Marketing and Promotions
CREATE TABLE coupons (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(50),
    discount_percentage DECIMAL(5, 2) CHECK (discount_percentage BETWEEN 0 AND 100),
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    max_uses INT,
    times_used INT DEFAULT 0
);

CREATE TABLE newsletters (
    newsletter_id SERIAL PRIMARY KEY,
    subject VARCHAR(255),
    content TEXT,
    sent_at TIMESTAMP
);

CREATE TABLE subscribers (
    subscriber_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    subscribed_at TIMESTAMP DEFAULT NOW()
);

-- Analytics and Logs
CREATE TABLE page_views (
    view_id SERIAL PRIMARY KEY,
    user_id INT,
    page_url TEXT,
    viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE search_queries (
    query_id SERIAL PRIMARY KEY,
    user_id INT,
    search_text VARCHAR(255),
    searched_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE error_logs (
    error_id SERIAL PRIMARY KEY,
    error_message TEXT,
    occurred_at TIMESTAMP DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE
);

-- Miscellaneous
CREATE TABLE wishlists (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wishlist_items (
    wishlist_item_id SERIAL PRIMARY KEY,
    wishlist_id INT,
    product_id INT
);

CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT,
    product_id INT,
    added_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT,
    message TEXT,
    sent_at TIMESTAMP DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT,
    action TEXT,
    action_timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referral_programs (
    program_id SERIAL PRIMARY KEY,
    referrer_id INT,
    referee_id INT,
    reward_amount DECIMAL(10, 2),
    rewarded_at TIMESTAMP
);
