export const installIOSPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install on iPhone - DeepMine AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
        }
        .step-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        .step-card:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-2px);
        }
        .step-number {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #2979FF 0%, #1565C0 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 16px;
        }
        .icon-demo {
            font-size: 48px;
            color: #2979FF;
            margin: 20px 0;
        }
        .btn-primary {
            background: linear-gradient(135deg, #2979FF 0%, #1565C0 100%);
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(41, 121, 255, 0.4);
        }
    </style>
</head>
<body class="text-white">
    <div class="max-w-4xl mx-auto p-6">
        <!-- Header -->
        <div class="text-center mb-12 mt-8">
            <i class="fas fa-mobile-alt text-6xl mb-4" style="color: #2979FF;"></i>
            <h1 class="text-4xl font-bold mb-4">Install DeepMine AI on iPhone</h1>
            <p class="text-gray-300 text-lg">Follow these simple steps to add our app to your home screen</p>
        </div>

        <!-- Step 1 -->
        <div class="step-card">
            <div class="step-number">1</div>
            <h2 class="text-2xl font-bold mb-3">Open Safari Browser</h2>
            <p class="text-gray-300 mb-4">Make sure you are using <strong>Safari</strong> (not Chrome or other browsers). iOS PWAs only work in Safari.</p>
            <div class="icon-demo">
                <i class="fab fa-safari"></i>
            </div>
        </div>

        <!-- Step 2 -->
        <div class="step-card">
            <div class="step-number">2</div>
            <h2 class="text-2xl font-bold mb-3">Tap the Share Button</h2>
            <p class="text-gray-300 mb-4">Look for the <strong>Share icon</strong> at the bottom of Safari (square with arrow pointing up)</p>
            <div class="icon-demo">
                <i class="fas fa-share-square"></i>
            </div>
        </div>

        <!-- Step 3 -->
        <div class="step-card">
            <div class="step-number">3</div>
            <h2 class="text-2xl font-bold mb-3">Select "Add to Home Screen"</h2>
            <p class="text-gray-300 mb-4">Scroll down in the share menu and tap <strong>"Add to Home Screen"</strong></p>
            <div class="icon-demo">
                <i class="fas fa-plus-square"></i>
            </div>
        </div>

        <!-- Step 4 -->
        <div class="step-card">
            <div class="step-number">4</div>
            <h2 class="text-2xl font-bold mb-3">Tap "Add"</h2>
            <p class="text-gray-300 mb-4">Confirm by tapping <strong>"Add"</strong> in the top right corner</p>
            <div class="icon-demo">
                <i class="fas fa-check-circle"></i>
            </div>
        </div>

        <!-- Step 5 -->
        <div class="step-card">
            <div class="step-number">5</div>
            <h2 class="text-2xl font-bold mb-3">Open from Home Screen</h2>
            <p class="text-gray-300 mb-4">Find the <strong>DeepMine AI</strong> icon on your home screen and tap it to open the app!</p>
            <div class="icon-demo">
                <i class="fas fa-rocket"></i>
            </div>
        </div>

        <!-- Important Notes -->
        <div class="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-6 mb-8">
            <h3 class="text-xl font-bold mb-3 flex items-center">
                <i class="fas fa-exclamation-triangle mr-3" style="color: #FFC107;"></i>
                Important for iPhone Users
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Use Safari only</strong> - Chrome and other browsers will not work for iOS installation</li>
                <li><strong>HTTPS required</strong> - Make sure you are on https://www.deepmineai.vip</li>
                <li><strong>iOS 11.3+</strong> - Your iPhone needs iOS 11.3 or later</li>
                <li><strong>Works offline</strong> - Once installed, the app will work even without internet (cached data)</li>
            </ul>
        </div>

        <!-- Benefits -->
        <div class="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-6 mb-8">
            <h3 class="text-xl font-bold mb-3 flex items-center">
                <i class="fas fa-star mr-3" style="color: #2979FF;"></i>
                Why Install the App?
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300">
                <li>✅ <strong>Faster access</strong> - Launch directly from home screen</li>
                <li>✅ <strong>Full-screen mode</strong> - No browser UI, more space</li>
                <li>✅ <strong>Works offline</strong> - View cached data without internet</li>
                <li>✅ <strong>Push notifications</strong> - Get alerts for earnings and withdrawals</li>
                <li>✅ <strong>Native feel</strong> - Looks and feels like a real app</li>
            </ul>
        </div>

        <!-- CTA Buttons -->
        <div class="text-center space-y-4 mb-12">
            <a href="/dashboard" class="btn-primary">
                <i class="fas fa-tachometer-alt mr-2"></i>
                Go to Dashboard
            </a>
            <br>
            <a href="/" class="text-blue-400 hover:text-blue-300 underline">
                <i class="fas fa-home mr-2"></i>
                Back to Homepage
            </a>
        </div>

        <!-- Video Tutorial (Optional) -->
        <div class="text-center mb-12">
            <h3 class="text-2xl font-bold mb-4">Need Visual Help?</h3>
            <p class="text-gray-300 mb-6">Watch a quick video tutorial on installing PWAs on iPhone</p>
            <a href="https://www.youtube.com/results?search_query=how+to+add+pwa+to+home+screen+iphone" 
               target="_blank" 
               class="btn-primary">
                <i class="fab fa-youtube mr-2"></i>
                Watch Tutorial on YouTube
            </a>
        </div>
    </div>
</body>
</html>
`
