# Images Setup Guide

This portfolio site uses local images instead of external CDN links for better performance and reliability.

## Current Status

The HTML has been updated to reference local image paths. However, the actual image files need to be downloaded from the CDN.

## SVG Icons Available

The following SVG icons have been created and are ready to use:

- **UI Icons**: `images/icons/dropdown-arrow.svg`, `images/icons/arrow-right-circle.svg`, `images/icons/arrow-right-circle-white.svg`
- **Social Icons**: `images/social/youtube.svg`, `images/social/twitter.svg`, `images/social/instagram.svg`
- **Placeholder Logo**: `images/icons/logo-placeholder.svg`

## Downloading Images

To download all images from the CDN, run the provided script:

```bash
./download-images.sh
```

This script will download:
- Favicon and app icons
- Emoji images (camping, sparkles, seedling, party popper)
- Resource card background images
- Work section feature images
- Home office hero image (with responsive versions)
- Social media icons
- Logo animation (Lottie JSON)

## Image Directory Structure

```
images/
├── icons/           # Favicons, logos, UI icons
├── emojis/          # Emoji images
├── resources/       # Resource card backgrounds
├── work/            # Work section images
└── social/          # Social media icons
```

## Manual Download (if script fails)

If the download script doesn't work in your environment, you can manually download images from the URLs listed in `download-images.sh` using your browser or a different tool.

## Notes

- All images in the HTML now point to local paths
- SVG icons are already included and don't need to be downloaded
- The site will show broken images until you run the download script
- Some images have responsive versions (srcset) for different screen sizes
