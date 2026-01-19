-- Update existing packages with real data from landing page
-- Keep IDs to preserve foreign key relationships with user_miners

-- Update package 1: H800 8400G Server (Premium)
UPDATE mining_packages 
SET name = 'H800 8400G Server',
    hash_rate = 990,
    price = 50000,
    daily_earnings = 900,
    duration_days = 180,
    description = 'Ultimate computing power with NVIDIA H800 GPUs. Intel Xeon Silver 4310, 128GB RAM + 4TB SSD, 8x NVIDIA H800 GPU. 180-day contract for maximum returns.',
    is_active = 1
WHERE id = 1;

-- Update package 2: H800 6400G Server (High Performance) - HAS ACTIVE MINERS!
UPDATE mining_packages 
SET name = 'H800 6400G Server',
    hash_rate = 546,
    price = 30000,
    daily_earnings = 540,
    duration_days = 180,
    description = 'High-performance solution with NVIDIA H800 technology for serious miners. Intel Xeon Silver 4310, 64GB RAM + 2TB SSD, 8x NVIDIA H800 GPU.',
    is_active = 1
WHERE id = 2;

-- Update package 3: H800 320G Server (East China)
UPDATE mining_packages 
SET name = 'H800 320G Server',
    hash_rate = 168,
    price = 11000,
    daily_earnings = 198,
    duration_days = 180,
    description = 'East China Region deployment with reliable H800 GPU performance. Intel Xeon Silver 4310, 64GB RAM + 1TB SSD, 8x NVIDIA H800 GPU.',
    is_active = 1
WHERE id = 3;

-- Update package 4: H200 120G Server (North China)
UPDATE mining_packages 
SET name = 'H200 120G Server',
    hash_rate = 108,
    price = 7000,
    daily_earnings = 126,
    duration_days = 180,
    description = 'North China Region with advanced Supermicro infrastructure and H200 GPUs. Supermicro SYS-821GE, 128GB DDR5 RAM, 8x NVIDIA H200 GPU.',
    is_active = 1
WHERE id = 4;

-- Add package 5 if it doesn't exist: H200 84G Server (Hong Kong)
INSERT OR REPLACE INTO mining_packages (id, name, hash_rate, price, daily_earnings, duration_days, description, is_active, created_at)
VALUES (5, 'H200 84G Server', 88, 5000, 90, 180, 'Hong Kong Cloud Server with premium connectivity and H200 performance. Supermicro SYS-821GE, 128GB DDR5 RAM, 8x NVIDIA H200 GPU.', 1, datetime('now'));
