-- ================================
-- Seed Data: Mining Packages (10 Server Models)
-- ================================

INSERT OR IGNORE INTO mining_packages (id, name, model_type, hash_rate, power_consumption, daily_return_rate, min_investment, max_investment, min_contract_days, max_contract_days, description, is_active, sort_order) VALUES
(1, 'NVIDIA H800', 'GPU', '450 TH/s', '5300W', 0.8, 100, 100000, 30, 365, 'Professional-grade AI processing with 80GB HBM3 memory. Optimized for large-scale mining operations.', 1, 1),
(2, 'NVIDIA H200', 'GPU', '500 TH/s', '5600W', 0.9, 150, 100000, 30, 365, 'Next-generation Hopper architecture with 141GB HBM3e memory. Maximum efficiency for advanced mining.', 1, 2),
(3, 'NVIDIA A100 80GB', 'GPU', '380 TH/s', '4800W', 0.75, 80, 80000, 30, 365, 'Enterprise AI accelerator with 80GB memory. Proven reliability for continuous mining operations.', 1, 3),
(4, 'NVIDIA A100 40GB', 'GPU', '320 TH/s', '4200W', 0.7, 60, 60000, 30, 365, 'Balanced performance accelerator perfect for mid-scale mining deployments.', 1, 4),
(5, 'RTX 4090', 'Consumer GPU', '280 TH/s', '3500W', 0.65, 50, 50000, 30, 365, 'High-performance consumer GPU adapted for efficient mining with excellent power efficiency.', 1, 5),
(6, 'RTX 4080', 'Consumer GPU', '220 TH/s', '2800W', 0.6, 40, 40000, 30, 365, 'Advanced gaming GPU optimized for mining operations with great cost-to-performance ratio.', 1, 6),
(7, 'RTX 4070 Ti', 'Consumer GPU', '180 TH/s', '2400W', 0.55, 30, 30000, 30, 365, 'Efficient mid-range solution for entry-level to intermediate mining contracts.', 1, 7),
(8, 'NVIDIA L40', 'Data Center GPU', '350 TH/s', '4500W', 0.72, 70, 70000, 30, 365, 'Professional data center GPU designed for 24/7 mining workloads with excellent stability.', 1, 8),
(9, 'AMD MI250X', 'GPU', '400 TH/s', '4900W', 0.77, 90, 90000, 30, 365, 'High-performance AMD compute GPU with dual-die architecture for maximum mining throughput.', 1, 9),
(10, 'Antminer S19 Pro', 'ASIC', '110 TH/s', '3250W', 0.5, 25, 25000, 30, 365, 'Industry-standard Bitcoin ASIC miner with proven track record and reliable performance.', 1, 10);
