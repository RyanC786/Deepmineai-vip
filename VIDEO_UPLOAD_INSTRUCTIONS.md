# Hero Video Upload Instructions

## How to Add Your Hero Video Background

When you're ready to add your hero video, follow these steps:

### Step 1: Upload Video File
Upload your video file to `/home/user/webapp/public/static/` directory with the name `hero-video.mp4` (or any video format you prefer).

### Step 2: Update Hero Section CSS
The CSS code to add video background is already prepared. You'll need to update the `.hero` section in `/public/static/styles.css`:

```css
.hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 80px;
    overflow: hidden;
}

/* Add after .hero selector */
.hero-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3; /* Adjust opacity as needed */
    z-index: 0;
}

.hero-video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        rgba(11, 15, 30, 0.8) 0%,
        rgba(41, 121, 255, 0.2) 50%,
        rgba(11, 15, 30, 0.8) 100%
    );
    z-index: 0;
}
```

### Step 3: Update HTML Structure
In `/src/index.tsx`, update the hero section to include the video:

```html
<!-- Hero Section -->
<section class="hero" id="hero">
    <!-- Add video background -->
    <video class="hero-video" autoplay loop muted playsinline>
        <source src="/static/hero-video.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <div class="hero-video-overlay"></div>
    
    <div class="particles" id="particles"></div>
    <div class="hero-content">
        <!-- Rest of hero content stays the same -->
    </div>
</section>
```

### Step 4: Rebuild and Restart
After making changes:

```bash
cd /home/user/webapp
npm run build
pm2 restart deepmine-ai
```

## Video Recommendations

### Format
- **Container**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD) or 3840x2160 (4K)
- **Frame Rate**: 30fps or 60fps
- **Bitrate**: 5-10 Mbps for good quality

### Content Style
Based on your futuristic DeepMine AI theme, consider videos with:
- Digital/circuit board animations
- Abstract data flowing
- Cosmic/space themes with stars and particles
- AI neural network visualizations
- Cryptocurrency mining animations
- Blue, violet, and cyan color schemes

### Duration
- **Loop Length**: 10-30 seconds (for seamless looping)
- **File Size**: Try to keep under 10MB for fast loading

### Optimization Tips
1. **Compress the video** using tools like HandBrake or FFmpeg
2. **Use poster attribute** for quick first frame display
3. **Consider WebM format** as alternative for better compression
4. **Lazy load** on mobile devices to save bandwidth

## Alternative: YouTube/Vimeo Embed
If you prefer hosting the video externally:

```html
<div class="hero-video-container">
    <iframe 
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID&controls=0&showinfo=0&rel=0&modestbranding=1"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
    </iframe>
</div>
```

## Testing Checklist
After adding the video:
- [ ] Video loads and plays automatically
- [ ] Video loops seamlessly
- [ ] Text remains readable over video
- [ ] Mobile devices show video correctly
- [ ] Page load time is acceptable
- [ ] Video doesn't cause performance issues

## Need Help?
If you need assistance implementing the video, just let me know and I can help update the code for you!
