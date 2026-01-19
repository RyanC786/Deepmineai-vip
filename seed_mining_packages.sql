-- Insert default mining packages
INSERT OR IGNORE INTO mining_packages (name, hash_rate, price, daily_earnings, duration_days, description) VALUES
  ('Starter', 1.0, 99.99, 2.50, 30, 'Perfect for beginners - 1 TH/s for 30 days'),
  ('Professional', 5.0, 449.99, 13.50, 60, 'Best value - 5 TH/s for 60 days'),
  ('Enterprise', 10.0, 849.99, 28.00, 90, 'Maximum power - 10 TH/s for 90 days'),
  ('Ultimate', 25.0, 1999.99, 72.00, 180, 'Elite mining - 25 TH/s for 180 days');
