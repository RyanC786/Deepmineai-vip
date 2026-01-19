-- Seed VIP levels data

-- Insert VIP levels (VIP1 to VIP10)
INSERT INTO vip_levels (level, name, profit_share, min_total_purchase, min_referrals) VALUES
  (1, 'VIP1', 3.0, 0, 0),
  (2, 'VIP2', 3.5, 1000, 1),
  (3, 'VIP3', 4.0, 5000, 3),
  (4, 'VIP4', 4.2, 10000, 5),
  (5, 'VIP5', 4.4, 20000, 10),
  (6, 'VIP6', 4.6, 40000, 15),
  (7, 'VIP7', 4.7, 60000, 20),
  (8, 'VIP8', 4.8, 80000, 30),
  (9, 'VIP9', 4.9, 100000, 40),
  (10, 'VIP10', 5.0, 150000, 50);
