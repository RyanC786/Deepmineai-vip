export const faqPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ - DeepMine AI | Frequently Asked Questions</title>
    <meta name="description" content="Get answers to common questions about DeepMine AI cloud mining platform, investments, withdrawals, and more.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body class="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white min-h-screen">
    
    <!-- Header -->
    <header class="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <i class="fas fa-microchip text-3xl text-blue-400"></i>
                    <div>
                        <h1 class="text-2xl font-bold">DeepMine AI</h1>
                        <p class="text-xs text-gray-400">AI-Powered Cloud Mining</p>
                    </div>
                </div>
                
                <nav id="desktopNav" class="hidden md:flex items-center gap-6">
                    <!-- Navigation will be dynamically set based on login status -->
                </nav>
                
                <button class="md:hidden text-white" onclick="toggleMobileMenu()">
                    <i class="fas fa-bars text-2xl"></i>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobileMenu" class="md:hidden mt-4 space-y-3 hidden">
                <!-- Mobile navigation will be dynamically set based on login status -->
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="container mx-auto px-6 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                <i class="fas fa-question-circle text-4xl text-white"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p class="text-xl text-white/90 max-w-2xl mx-auto">
                Everything you need to know about DeepMine AI cloud mining platform
            </p>
            
            <!-- Search Box -->
            <div class="mt-8 max-w-2xl mx-auto">
                <div class="relative">
                    <input 
                        type="text" 
                        id="faqSearch" 
                        placeholder="Search for answers..." 
                        class="w-full px-6 py-4 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                        onkeyup="searchFAQ()"
                    >
                    <i class="fas fa-search absolute right-6 top-1/2 transform -translate-y-1/2 text-white/60"></i>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Categories -->
    <section class="py-12">
        <div class="container mx-auto px-6">
            
            <!-- Category Navigation -->
            <div class="flex flex-wrap gap-3 justify-center mb-12">
                <button onclick="filterCategory('all')" class="category-btn active px-6 py-2 rounded-lg font-semibold transition">
                    <i class="fas fa-th-large mr-2"></i> All Questions
                </button>
                <button onclick="filterCategory('general')" class="category-btn px-6 py-2 rounded-lg font-semibold transition">
                    <i class="fas fa-info-circle mr-2"></i> General
                </button>
                <button onclick="filterCategory('investment')" class="category-btn px-6 py-2 rounded-lg font-semibold transition">
                    <i class="fas fa-dollar-sign mr-2"></i> Investment
                </button>
                <button onclick="filterCategory('earnings')" class="category-btn px-6 py-2 rounded-lg font-semibold transition">
                    <i class="fas fa-chart-line mr-2"></i> Earnings
                </button>
                <button onclick="filterCategory('technical')" class="category-btn px-6 py-2 rounded-lg font-semibold transition">
                    <i class="fas fa-cogs mr-2"></i> Technical
                </button>
                <button onclick="filterCategory('support')" class="category-btn px-6 py-2 rounded-lg font-semibold transition">
                    <i class="fas fa-headset mr-2"></i> Support
                </button>
            </div>

            <!-- FAQ Accordion -->
            <div class="max-w-4xl mx-auto space-y-4" id="faqContainer">
                ${generateFAQHTML()}
            </div>

            <!-- No Results Message -->
            <div id="noResults" class="hidden text-center py-12">
                <i class="fas fa-search text-6xl text-gray-600 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-400 mb-2">No results found</h3>
                <p class="text-gray-500">Try different keywords or browse by category</p>
            </div>

        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Still Have Questions?</h2>
            <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Our 24/7 support team is here to help you with any questions
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@deepmineai.vip" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2">
                    <i class="fas fa-envelope"></i>
                    Email Support
                </a>
                <a href="/pre-register" class="bg-black/30 backdrop-blur-lg border border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-black/50 transition inline-flex items-center justify-center gap-2">
                    <i class="fas fa-rocket"></i>
                    Get Started Now
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black/50 backdrop-blur-lg py-12 border-t border-white/10">
        <div class="container mx-auto px-6">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <div class="flex items-center gap-3 mb-4">
                        <i class="fas fa-microchip text-2xl text-blue-400"></i>
                        <h3 class="text-xl font-bold">DeepMine AI</h3>
                    </div>
                    <p class="text-gray-400 text-sm">
                        AI-powered cloud mining platform for cryptocurrency mining
                    </p>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="/" class="hover:text-white transition">Home</a></li>
                        <li><a href="/faq" class="hover:text-white transition">FAQ</a></li>
                        <li><a href="/login" class="hover:text-white transition">Login</a></li>
                        <li><a href="/pre-register" class="hover:text-white transition">Get Started</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Legal</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="/terms" class="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Contact</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><i class="fas fa-envelope mr-2"></i> support@deepmineai.vip</li>
                        <li><i class="fas fa-clock mr-2"></i> 24/7 Support</li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                <p>© 2026 DeepMine AI. All rights reserved. | Company No: SC873661</p>
            </div>
        </div>
    </footer>

    <style>
        .category-btn {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .category-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
        
        .category-btn.active {
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
            color: white;
            border-color: transparent;
        }
        
        .faq-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s;
        }
        
        .faq-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        .faq-question {
            padding: 20px 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s;
        }
        
        .faq-question:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            padding: 0 24px;
        }
        
        .faq-answer.active {
            max-height: 2000px;
            padding: 0 24px 24px 24px;
        }
        
        .faq-icon {
            transition: transform 0.3s;
        }
        
        .faq-icon.rotated {
            transform: rotate(180deg);
        }
        
        mark {
            background-color: #FCD34D;
            color: #1F2937;
            padding: 2px 4px;
            border-radius: 2px;
        }
    </style>

    <script>
        // Helper function to get cookie value
        function getCookie(name) {
            const value = \`; \${document.cookie}\`;
            const parts = value.split(\`; \${name}=\`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }
        
        // Check if user is logged in and set appropriate navigation
        function initializeNavigation() {
            // Safeguard: Only run on FAQ page
            if (!window.location.pathname.includes('/faq')) {
                console.log('[FAQ Navigation] Not on FAQ page, skipping initialization');
                return;
            }
            
            // Check for auth token in cookies (this is how the app stores authentication)
            const isLoggedIn = getCookie('auth_token') || getCookie('token');
            
            console.log('[FAQ Navigation] Debug:', {
                pathname: window.location.pathname,
                isLoggedIn: !!isLoggedIn,
                hasCookies: !!document.cookie
            });
            
            const desktopNav = document.getElementById('desktopNav');
            const mobileMenu = document.getElementById('mobileMenu');
            
            if (isLoggedIn) {
                // User is logged in - show dashboard navigation
                desktopNav.innerHTML = \`
                    <a href="/dashboard" class="text-gray-300 hover:text-white transition flex items-center gap-2">
                        <i class="fas fa-arrow-left"></i>
                        Back to Dashboard
                    </a>
                    <a href="/faq" class="text-blue-400 font-semibold">FAQ</a>
                    <a href="/machines" class="text-gray-300 hover:text-white transition">Machines</a>
                    <a href="/referrals" class="text-gray-300 hover:text-white transition">Referrals</a>
                \`;
                
                mobileMenu.innerHTML = \`
                    <a href="/dashboard" class="block text-gray-300 hover:text-white transition py-2">
                        <i class="fas fa-arrow-left mr-2"></i> Back to Dashboard
                    </a>
                    <a href="/faq" class="block text-blue-400 font-semibold py-2">FAQ</a>
                    <a href="/machines" class="block text-gray-300 hover:text-white transition py-2">Machines</a>
                    <a href="/referrals" class="block text-gray-300 hover:text-white transition py-2">Referrals</a>
                \`;
            } else {
                // User is not logged in - show public navigation
                desktopNav.innerHTML = \`
                    <a href="/" class="text-gray-300 hover:text-white transition">Home</a>
                    <a href="/faq" class="text-blue-400 font-semibold">FAQ</a>
                    <a href="/login" class="text-gray-300 hover:text-white transition">Login</a>
                    <a href="/pre-register" class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition">
                        Get Started
                    </a>
                \`;
                
                mobileMenu.innerHTML = \`
                    <a href="/" class="block text-gray-300 hover:text-white transition py-2">Home</a>
                    <a href="/faq" class="block text-blue-400 font-semibold py-2">FAQ</a>
                    <a href="/login" class="block text-gray-300 hover:text-white transition py-2">Login</a>
                    <a href="/pre-register" class="block bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold text-center">
                        Get Started
                    </a>
                \`;
            }
        }
        
        // Initialize navigation on page load
        document.addEventListener('DOMContentLoaded', initializeNavigation);
        
        // Toggle mobile menu
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }
        
        // Toggle FAQ item
        function toggleFAQ(id) {
            const answer = document.getElementById(\`answer-\${id}\`);
            const icon = document.getElementById(\`icon-\${id}\`);
            
            answer.classList.toggle('active');
            icon.classList.toggle('rotated');
        }
        
        // Search FAQ
        function searchFAQ() {
            const searchTerm = document.getElementById('faqSearch').value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            let visibleCount = 0;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question-text').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    visibleCount++;
                    
                    // Highlight matching text
                    if (searchTerm) {
                        highlightText(item, searchTerm);
                    } else {
                        removeHighlight(item);
                    }
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide no results message
            const noResults = document.getElementById('noResults');
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
        
        // Filter by category
        function filterCategory(category) {
            const faqItems = document.querySelectorAll('.faq-item');
            const categoryBtns = document.querySelectorAll('.category-btn');
            
            // Update active button
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Filter items
            let visibleCount = 0;
            faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Clear search
            document.getElementById('faqSearch').value = '';
            
            // Show/hide no results
            const noResults = document.getElementById('noResults');
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
        
        // Highlight search terms
        function highlightText(element, searchTerm) {
            const question = element.querySelector('.faq-question-text');
            const answer = element.querySelector('.faq-answer-content');
            
            [question, answer].forEach(el => {
                const text = el.textContent;
                const regex = new RegExp(\`(\${searchTerm})\`, 'gi');
                const highlighted = text.replace(regex, '<mark>$1</mark>');
                el.innerHTML = highlighted;
            });
        }
        
        // Remove highlight
        function removeHighlight(element) {
            const question = element.querySelector('.faq-question-text');
            const answer = element.querySelector('.faq-answer-content');
            
            [question, answer].forEach(el => {
                const text = el.textContent;
                el.textContent = text;
            });
        }
    </script>

</body>
</html>
`;

function generateFAQHTML() {
    const faqs = [
        {
            category: 'general',
            question: 'What is DeepMine AI?',
            answer: 'DeepMine AI is an AI-powered cloud mining platform that allows you to invest in cryptocurrency mining computing power without owning or managing physical hardware. We operate mining facilities with enterprise-grade GPUs (NVIDIA H800, H200, A100, RTX 4090) across multiple regions (Hong Kong, East/North/South China). Our AI system optimizes mining operations 24/7 by dynamically selecting the most profitable cryptocurrencies, mining pools, and power management settings.'
        },
        {
            category: 'general',
            question: 'How is this different from regular cloud mining?',
            answer: 'Traditional cloud mining is static - you mine one cryptocurrency at fixed settings. DeepMine AI is dynamic:<br><br>• <strong>AI-powered optimization:</strong> Automatically switches between most profitable cryptocurrencies in real-time<br>• <strong>Smart pool selection:</strong> Dynamically chooses best-performing mining pools<br>• <strong>Power management:</strong> Optimizes energy consumption based on profitability<br>• <strong>Predictive maintenance:</strong> Monitors hardware health to prevent downtime<br><br><strong>Result:</strong> 30-40% higher efficiency compared to static mining operations'
        },
        {
            category: 'general',
            question: 'Is DeepMine AI a scam?',
            answer: 'We understand the skepticism - the crypto mining industry has many scams. We encourage you to evaluate us using our transparency measures. We pass most legitimacy checkpoints (transparent hardware, easy withdrawals, technical education, reasonable structure). However, our returns are higher than industry average, which warrants caution. We recommend starting with $500, testing withdrawals within 13 days, and verifying operations personally before scaling.'
        },
        {
            category: 'general',
            question: 'Why are your returns so high (174%-227% ROI)?',
            answer: 'Our returns are 2-3x higher than typical cloud mining platforms due to four competitive advantages:<br><br><strong>1. AI Optimization (30-40% efficiency gain):</strong> Dynamic cryptocurrency and pool switching<br><strong>2. Direct Operations (40-60% cost savings):</strong> No reseller markups - you invest directly<br><strong>3. Enterprise Hardware (2-3x better performance):</strong> Access to H800/H200/A100 GPUs not available retail<br><strong>4. Scale Economics (50-60% lower costs):</strong> Industrial electricity rates, bulk procurement, optimized infrastructure<br><br>However, we acknowledge these returns are exceptional and encourage verification before believing our claims.'
        },
        {
            category: 'general',
            question: 'What cryptocurrencies do you mine?',
            answer: 'Our AI system mines multiple cryptocurrencies dynamically based on real-time profitability analysis. This includes major cryptocurrencies (Bitcoin, Ethereum), emerging altcoins, and other GPU-mineable coins. The AI automatically switches to whatever is most profitable at any given moment, which is why we express returns in USD/day rather than specific cryptocurrency amounts.'
        },
        {
            category: 'general',
            question: 'Do I need technical knowledge to invest?',
            answer: 'No. You don\'t need to understand mining algorithms, hardware specifications, or blockchain technology. You simply:<br><br>1. Choose a package based on your investment amount<br>2. Purchase the package<br>3. Check your dashboard daily to see earnings<br>4. Request withdrawals when desired<br><br>The AI handles all technical complexity. You just monitor results.'
        },
        {
            category: 'investment',
            question: 'What\'s the minimum investment?',
            answer: '<strong>$500</strong> (RTX 4090 24G Server package)<br><br>This is our entry-level package designed for:<br>• First-time cloud mining investors<br>• People wanting to test our platform before scaling<br>• Those with limited capital but interested in crypto mining<br><br><strong>Returns:</strong><br>Daily return: $8/day<br>180-day total: $1,440<br>Net profit: $940<br>ROI: 188%'
        },
        {
            category: 'investment',
            question: 'What packages are available?',
            answer: '<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-white/20"><th class="py-2 px-4">Package</th><th class="py-2 px-4">Investment</th><th class="py-2 px-4">Daily Return</th><th class="py-2 px-4">180-Day ROI</th></tr></thead><tbody class="text-gray-300"><tr class="border-b border-white/10"><td class="py-2 px-4">RTX 4090 24G</td><td class="py-2 px-4">$500</td><td class="py-2 px-4">$8/day</td><td class="py-2 px-4">188%</td></tr><tr class="border-b border-white/10"><td class="py-2 px-4">H800 2400</td><td class="py-2 px-4">$5,000</td><td class="py-2 px-4">$88/day</td><td class="py-2 px-4">216.8%</td></tr><tr class="border-b border-white/10"><td class="py-2 px-4">H200 3200</td><td class="py-2 px-4">$7,000</td><td class="py-2 px-4">$108/day</td><td class="py-2 px-4">177.7%</td></tr><tr class="border-b border-white/10"><td class="py-2 px-4">H800 3200G</td><td class="py-2 px-4">$11,000</td><td class="py-2 px-4">$168/day</td><td class="py-2 px-4">174.9%</td></tr><tr class="border-b border-white/10"><td class="py-2 px-4">H800 6400G</td><td class="py-2 px-4">$30,000</td><td class="py-2 px-4">$545/day</td><td class="py-2 px-4">227%</td></tr><tr><td class="py-2 px-4">H800 8400G</td><td class="py-2 px-4">$50,000</td><td class="py-2 px-4">$909/day</td><td class="py-2 px-4">227.2%</td></tr></tbody></table></div><br>All packages run for 180-day contracts with daily profit settlement.'
        },
        {
            category: 'investment',
            question: 'Can I buy multiple packages?',
            answer: 'Yes. You can own one unit of each package tier. For example, you could own:<br><br>• 1x RTX 4090 ($500)<br>• 1x H800 2400 ($5,000)<br>• 1x H200 3200 ($7,000)<br>• Combined daily income: $204/day<br><br>This diversification strategy is recommended for risk management.'
        },
        {
            category: 'earnings',
            question: 'What\'s the minimum withdrawal amount?',
            answer: '<strong>$100 USDT</strong><br><br>This is one of the lowest minimums in the cloud mining industry (most platforms require $500-1,000).<br><br><strong>Why we keep it low:</strong><br>We want you to test our withdrawal process quickly. With a $100 minimum:<br><br>• $500 package: Test withdrawal on Day 13 ($8/day × 13 = $104)<br>• $5,000 package: Test withdrawal on Day 2 ($88/day × 2 = $176)<br>• $30,000+ packages: Test withdrawal on Day 1 (earn $168-909/day)<br><br>Early verification builds trust. We\'d rather you test quickly and scale confidently than force you to wait months before your first withdrawal.'
        },
        {
            category: 'earnings',
            question: 'Can I withdraw every day?',
            answer: 'Yes, as long as your balance is at least $100 USDT.<br><br><strong>Daily withdrawal capability:</strong><br>All packages earning $100+/day can withdraw daily:<br><br>• H800 2400: $88/day (every 2 days)<br>• H200 3200: $108/day ✅ DAILY<br>• H800 3200G: $168/day ✅ DAILY<br>• H800 6400G: $545/day ✅ DAILY<br>• H800 8400G: $909/day ✅ DAILY<br><br><strong>Entry packages:</strong><br>• RTX 4090: $8/day (withdraw every 13 days when you reach $100)<br><br>No penalties for frequent withdrawals. Withdraw as often as you want.'
        },
        {
            category: 'earnings',
            question: 'How long does the first withdrawal take to process?',
            answer: '<strong>24-48 hours on average.</strong><br><br><strong>Timeline:</strong><br>• <strong>Request:</strong> Submit withdrawal from your dashboard<br>• <strong>Processing:</strong> 24-48 hours (sometimes faster during low-volume periods)<br>• <strong>Receive:</strong> Funds arrive in your designated USDT wallet<br><br><strong>First withdrawal testing strategy:</strong><br><br>For $500 package:<br>• Day 13: Request withdrawal ($104)<br>• Day 14-15: Funds arrive<br>• Total verification time: 2 weeks<br><br>For premium packages ($5,000+):<br>• Day 1-2: Request withdrawal<br>• Day 2-3: Funds arrive<br>• Total verification time: 2-3 days'
        },
        {
            category: 'earnings',
            question: 'Is there a withdrawal limit or lock period?',
            answer: '<strong>No locks. No limits.</strong> Withdraw anytime after reaching $100 minimum.<br><br><strong>What we DON\'T have:</strong><br>• No "maturity period" (some platforms lock funds for 30-90 days)<br>• No "withdrawal windows" (some only allow withdrawals on specific dates)<br>• No "contract lock" (your daily earnings are available for withdrawal anytime)<br>• No daily/weekly withdrawal limits<br>• No penalties for "early" withdrawal<br><br><strong>Your contract:</strong><br><strong>Initial investment:</strong> Locked for 180-day contract period<br><strong>Daily earnings:</strong> Available for withdrawal as soon as you hit $100'
        },
        {
            category: 'earnings',
            question: 'How are daily returns calculated?',
            answer: 'Daily returns are based on:<br><br>1. Your package\'s computing power (e.g., RTX 4090 = specific hash rate)<br>2. Current cryptocurrency mining difficulty<br>3. Cryptocurrency market prices<br>4. Mining pool performance<br>5. AI optimization efficiency<br><br>Returns are expressed in USD per day (e.g., $8/day) for simplicity, though actual mining earns cryptocurrency that\'s converted to USD equivalent.'
        },
        {
            category: 'earnings',
            question: 'Are the daily returns guaranteed?',
            answer: 'No investment returns are guaranteed. However:<br><br>• We provide projected daily returns based on current conditions (e.g., $8/day for RTX 4090)<br>• Returns may fluctuate slightly based on cryptocurrency market prices and mining difficulty<br>• Historical performance shows consistency within 5-10% of projected returns<br>• You can verify actual returns daily in your dashboard<br><br>If actual returns significantly deviate from projections, that\'s a red flag you should investigate.'
        },
        {
            category: 'earnings',
            question: 'Are there withdrawal fees?',
            answer: '<strong>Yes, a 2% withdrawal fee applies to all withdrawals.</strong><br><br>This fee covers:<br>• Network transaction costs<br>• Payment processing<br>• Security verification<br><br>Example:<br>• Withdraw $100 → Fee: $2 → You receive: $98<br>• Withdraw $1,000 → Fee: $20 → You receive: $980'
        },
        {
            category: 'technical',
            question: 'Where are your mining facilities located?',
            answer: 'We operate mining facilities across multiple regions:<br><br>• Hong Kong<br>• East China Region<br>• North China Region<br>• South China Region<br>• On-Chain cloud locations<br><br>Specific package details show which region your computing power operates in.'
        },
        {
            category: 'technical',
            question: 'What does "AI-powered" actually mean?',
            answer: 'Our AI system performs four core functions:<br><br><strong>1. Predictive Market Analysis</strong><br>• Monitors 100+ cryptocurrencies 24/7<br>• Analyzes difficulty adjustments, network conditions, price trends<br>• Predicts most profitable mining opportunities in real-time<br><br><strong>2. Automatic Pool Selection</strong><br>• Tests mining pool performance continuously<br>• Switches to pools with best profitability, lowest latency<br>• Avoids pools experiencing downtime or issues<br><br><strong>3. Smart Power Management</strong><br>• Adjusts GPU power consumption based on profit margins<br>• Scales up during high-profit periods, scales down during low-profit periods<br>• Optimizes electricity costs vs. mining rewards<br><br><strong>4. Hardware Health Monitoring</strong><br>• Monitors temperature, hash rate, performance 24/7<br>• Predicts hardware failures before they happen<br>• Triggers maintenance to prevent downtime<br><br><strong>Result:</strong> 30-40% higher efficiency than static mining.'
        },
        {
            category: 'technical',
            question: 'Do I own the physical hardware?',
            answer: 'No. You\'re investing in computing power (cloud mining), not purchasing physical equipment. We own and maintain the hardware. You receive the mining profits generated by your allocated computing power.<br><br><strong>Think of it like:</strong><br>• Buying a rental property (you own hardware) = Traditional mining<br>• Investing in a REIT (you own share of profits) = Cloud mining with DeepMine AI'
        },
        {
            category: 'technical',
            question: 'What happens if hardware breaks down?',
            answer: 'Hardware maintenance is our responsibility:<br><br>• We handle all repairs, replacements, and maintenance<br>• Our AI system performs predictive maintenance to prevent failures<br>• If downtime occurs, we have redundant systems to minimize impact<br>• Your contract continues - we absorb hardware risk'
        },
        {
            category: 'technical',
            question: 'Is this legal?',
            answer: '<strong>Cryptocurrency mining legality varies by jurisdiction:</strong><br><br>• Mining is legal in most countries (including US, UK, Canada, most of Europe)<br>• Mining is restricted in some regions (China has restrictions, though enforcement varies)<br>• We operate in jurisdictions where mining is permitted<br><br><strong>Your responsibility:</strong> Verify that participating in cloud mining is legal in YOUR country and that you comply with tax reporting requirements for any earnings.'
        },
        {
            category: 'investment',
            question: 'How long is the contract?',
            answer: '<strong>All packages run for 180 days (6 months).</strong> This is a standard contract period.<br><br><strong>After 180 days:</strong><br>• Your contract expires<br>• You keep all profits earned ($940-$113,620 depending on package)<br>• You can reinvest in a new contract if desired<br>• Or withdraw everything and exit'
        },
        {
            category: 'investment',
            question: 'What happens after the 180-day contract ends?',
            answer: 'You have three options:<br><br><strong>Option 1:</strong> Withdraw all profits and exit (you keep everything earned)<br><strong>Option 2:</strong> Reinvest profits into a new contract (compound growth)<br><strong>Option 3:</strong> Reinvest partial profits, withdraw the rest (balanced approach)<br><br>There\'s no automatic renewal - you decide what to do with your profits.'
        },
        {
            category: 'investment',
            question: 'Can I cancel my contract early?',
            answer: 'Contracts run for the full 180-day period. However, you can withdraw accumulated profits at any time (minimum $100 USDT). Your initial investment is locked for the contract duration, but your daily earnings are available for withdrawal.'
        },
        {
            category: 'general',
            question: 'Is there a referral program?',
            answer: 'Yes. Our affiliate program offers:<br><br><strong>Direct Referral Bonus:</strong> $80 for every friend who joins and purchases their first mining machine<br><br><strong>Downline Commission:</strong> $15 from each secondary referral\'s first purchase<br><br><strong>Daily Check-in Bonus:</strong> $1 bonus for logging in before 5:00 PM UK time'
        },
        {
            category: 'support',
            question: 'How do I contact customer support?',
            answer: '<strong>24/7 Support Available:</strong><br><br>• <strong>Email:</strong> support@deepmineai.vip<br>• <strong>Response Time:</strong> Typically within 2-4 hours<br><br>Our support team is here to help you with any questions or issues.'
        },
        {
            category: 'support',
            question: 'Is there a mobile app?',
            answer: 'Yes! Download our mobile app from your dashboard for convenient access to:<br><br>• Real-time earnings tracking<br>• Withdrawal requests<br>• Package management<br>• Support tickets<br><br>Available for both iOS and Android.'
        },
        {
            category: 'support',
            question: 'Do I need to pay taxes on my earnings?',
            answer: '<strong>We are not tax advisors, but generally:</strong><br><br>Cryptocurrency earnings are taxable in most countries:<br>• <strong>US:</strong> Crypto mining income is taxed as ordinary income<br>• <strong>UK:</strong> Crypto mining subject to income tax and potentially capital gains<br>• <strong>EU:</strong> Varies by country, typically taxable income<br><br><strong>Your responsibility:</strong><br>• Track all earnings and withdrawals<br>• Report to your tax authority as required<br>• Consult a tax professional familiar with cryptocurrency'
        },
        {
            category: 'support',
            question: 'Will you provide tax documents?',
            answer: 'You can export your earnings history from your dashboard:<br><br>• Daily earnings log<br>• Withdrawal transaction history<br>• Total income by month/year<br><br>Provide this to your tax preparer. We do not issue 1099 or similar tax forms (not required for international cloud mining platforms).'
        },
        {
            category: 'general',
            question: 'Is DeepMine AI registered/licensed?',
            answer: '<strong>DeepMine AI operates as DEEPMINE AI LIMITED</strong><br><br>Registered in: <strong>UNITED KINGDOM</strong><br>Company number: <strong>SC873661</strong><br><br>Cryptocurrency mining platforms are not currently required to hold specific licenses in most jurisdictions.'
        }
    ];
    
    return faqs.map((faq, index) => `
        <div class="faq-item" data-category="${faq.category}">
            <div class="faq-question" onclick="toggleFAQ(${index})">
                <div class="flex items-start gap-4 flex-1">
                    <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
                        Q
                    </div>
                    <h3 class="faq-question-text text-lg font-semibold flex-1">${faq.question}</h3>
                </div>
                <i id="icon-${index}" class="fas fa-chevron-down faq-icon text-gray-400"></i>
            </div>
            <div id="answer-${index}" class="faq-answer">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center font-bold">
                        A
                    </div>
                    <div class="faq-answer-content flex-1 text-gray-300 leading-relaxed">${faq.answer}</div>
                </div>
            </div>
        </div>
    `).join('');
}
