-- Update all mining packages with REALISTIC earnings based on $0.048 per TH/s per day
-- This is the NET PROFIT after electricity costs and power consumption

-- Package 1: H800 8400G Server
-- 990 TH/s × $0.048 = $47.52/day
UPDATE mining_packages 
SET daily_earnings = 47.52,
    description = '8x NVIDIA H800 GPUs | Enterprise AI Mining | 990 TH/s'
WHERE id = 1;

-- Package 2: H800 6400G Server  
-- 546 TH/s × $0.048 = $26.21/day
UPDATE mining_packages 
SET daily_earnings = 26.21,
    description = '6x NVIDIA H800 GPUs | High-Performance Mining | 546 TH/s'
WHERE id = 2;

-- Package 3: H800 320G Server
-- 168 TH/s × $0.048 = $8.06/day
UPDATE mining_packages 
SET daily_earnings = 8.06,
    description = '4x NVIDIA H800 GPUs | Professional Mining | 168 TH/s'
WHERE id = 3;

-- Package 4: H200 120G Server
-- 108 TH/s × $0.048 = $5.18/day
UPDATE mining_packages 
SET daily_earnings = 5.18,
    description = '3x NVIDIA H200 GPUs | Optimized Mining | 108 TH/s'
WHERE id = 4;

-- Package 5: H200 84G Server
-- 88 TH/s × $0.048 = $4.22/day
UPDATE mining_packages 
SET daily_earnings = 4.22,
    description = '2x NVIDIA H200 GPUs | Efficient Mining | 88 TH/s'
WHERE id = 5;

-- Package 6: RTX 4090 24G Server
-- 8 TH/s × $0.048 = $0.38/day
UPDATE mining_packages 
SET daily_earnings = 0.38,
    description = '1x NVIDIA RTX 4090 GPU | Entry-Level Mining | 8 TH/s'
WHERE id = 6;

-- Package 7: A100 72G Server
-- 28 TH/s × $0.048 = $1.34/day
UPDATE mining_packages 
SET daily_earnings = 1.34,
    description = '2x NVIDIA A100 GPUs | Balanced Mining | 28 TH/s'
WHERE id = 7;

-- Package 8: A100 48G Server
-- 18 TH/s × $0.048 = $0.86/day
UPDATE mining_packages 
SET daily_earnings = 0.86,
    description = '1x NVIDIA A100 GPU | Starter Mining | 18 TH/s'
WHERE id = 8;

-- Package 9: A100 96G Server
-- 38 TH/s × $0.048 = $1.82/day
UPDATE mining_packages 
SET daily_earnings = 1.82,
    description = '2x NVIDIA A100 96GB GPUs | Advanced Mining | 38 TH/s'
WHERE id = 9;

-- Verify the updates
SELECT 
    id,
    name,
    hash_rate,
    price,
    daily_earnings,
    duration_days,
    ROUND(daily_earnings * duration_days, 2) as total_return,
    ROUND((daily_earnings * duration_days), 2) as total_earnings,
    ROUND((daily_earnings * duration_days / price * 100), 2) as roi_percent,
    ROUND((price / (daily_earnings * duration_days)), 2) as payback_multiple
FROM mining_packages 
ORDER BY id;
