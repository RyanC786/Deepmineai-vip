-- Add missing packages from dashboard screenshots

-- 6. RTX 4090 24G Server (Starter - South China Region)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('RTX 4090 24G Server', 8, 500, 9, 180, 'South China Region - Affordable entry point with RTX 4090 performance. AMD EPYC 7542, 216GB RAM + 500GB SSD, GeForce RTX 4090 24GB.', 1);

-- 7. A100 72G Server (On-Chain)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('A100 72G Server', 28, 1500, 27, 180, 'Efficient on-chain solution with A100 GPUs for cost-effective mining. 2nd Gen Xeon Scalable, 200GB RAM + 1TB SSD, 8x NVIDIA A100 GPU.', 1);

-- 8. A100 48G Server (North China)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('A100 48G Server', 18, 1000, 18, 180, 'Entry-level enterprise server with A100 GPUs and 4th Gen processors. 4th Gen Xeon Scalable, 96GB RAM + 1TB SSD, 8x NVIDIA A100 GPU.', 1);

-- 9. A100 96G Server (On-Chain)
INSERT INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description, is_active)
VALUES ('A100 96G Server', 38, 2000, 36, 180, 'On-chain cloud rental with NVIDIA A100 GPUs for blockchain computing. 2nd Gen Xeon Scalable, 400GB RAM + 2TB SSD, 8x NVIDIA A100 GPU.', 1);
