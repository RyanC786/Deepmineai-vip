-- Delete old packages
DELETE FROM mining_packages;

-- Insert real mining packages from landing page

-- 1. H800 8400G Server (Premium)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('H800 8400G Server', 990, 50000, 900, 180, 'Ultimate computing power with NVIDIA H800 GPUs. Intel Xeon Silver 4310, 128GB RAM + 4TB SSD, 8x NVIDIA H800 GPU. 180-day contract for maximum returns.', 1);

-- 2. H800 6400G Server (High Performance)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('H800 6400G Server', 546, 30000, 540, 180, 'High-performance solution with NVIDIA H800 technology for serious miners. Intel Xeon Silver 4310, 64GB RAM + 2TB SSD, 8x NVIDIA H800 GPU.', 1);

-- 3. H800 320G Server (East China)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('H800 320G Server', 168, 11000, 198, 180, 'East China Region deployment with reliable H800 GPU performance. Intel Xeon Silver 4310, 64GB RAM + 1TB SSD, 8x NVIDIA H800 GPU.', 1);

-- 4. H200 120G Server (North China)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('H200 120G Server', 108, 7000, 126, 180, 'North China Region with advanced Supermicro infrastructure and H200 GPUs. Supermicro SYS-821GE, 128GB DDR5 RAM, 8x NVIDIA H200 GPU.', 1);

-- 5. H200 84G Server (Hong Kong)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('H200 84G Server', 88, 5000, 90, 180, 'Hong Kong Cloud Server with premium connectivity and H200 performance. Supermicro SYS-821GE, 128GB DDR5 RAM, 8x NVIDIA H200 GPU.', 1);
