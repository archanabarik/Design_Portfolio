#!/bin/bash

# Image Download Script for Archana Kumari Portfolio
# Run this script to download all images from the CDN to local storage

echo "Starting image download..."

# Create directory structure
mkdir -p images/{icons,emojis,resources,work,social}

# Download favicons
echo "Downloading favicons..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/613ff53daf424e2d2aa775dc_Frame%206876.png" -o images/icons/favicon.png
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/613ff547f536e40903b0d7f2_256.png" -o images/icons/apple-touch-icon.png
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/613ff547f536e40903b0d7f2_256.webp" -o images/icons/logo-256.webp

# Download dropdown arrow
echo "Downloading UI icons..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60cb509b5c9d3a3ff26f245f_dropdown%20arrow.svg" -o images/icons/dropdown-arrow.svg

# Download arrow icons
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60ca1816e0cff7af54bdd831_arrow-right-circle.svg" -o images/icons/arrow-right-circle.svg
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60ca2172a26ca447d8bcd912_arrow-right-circle-White.svg" -o images/icons/arrow-right-circle-white.svg

# Download emoji images
echo "Downloading emojis..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4bca99567d5c994484b30_camping_1f3d5-fe0f.png" -o images/emojis/camping.png
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4bccc0143dcedc1dceecb_sparkles_2728-2.png" -o images/emojis/sparkles.png
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4bc601e74bea9f1ada2fe_seedling_1f331.png" -o images/emojis/seedling.png
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4bc79600bd67e51adc974_party-popper_1f389.png" -o images/emojis/party-popper.png

# Download resource card images
echo "Downloading resource cards..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/624d57a9b71355666753fd66_DP%20COVER%207-2.webp" -o images/resources/dp-cover-7.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/624d51f2902f7ce58f531a3b_DP%20COVER%206.webp" -o images/resources/dp-cover-6.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/6353e5fc4f90fd89d99e4548_DP%20COVER%208.webp" -o images/resources/dp-cover-8.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/6353e5fc4f90fd89d99e4548_DP%20COVER%208-p-500.png" -o images/resources/dp-cover-8-500.png
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/624d481c038f0d8f2a23f4a3_DP%20COVER%201.webp" -o images/resources/dp-cover-1.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/624d481c038f0d8f2a23f4a3_DP%20COVER%201-p-500.webp" -o images/resources/dp-cover-1-500.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/624d4cb4ae9c529ed870159d_DP%20COVER%203.webp" -o images/resources/dp-cover-3.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/624d4cb4ae9c529ed870159d_DP%20COVER%203-p-500.webp" -o images/resources/dp-cover-3-500.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/646466fe6a1e3ce6ef572dc6_DP%20COVER%20Webflow%20Prelaunch%20Checklist.png" -o images/resources/webflow-checklist.png
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/646466fe6a1e3ce6ef572dc6_DP%20COVER%20Webflow%20Prelaunch%20Checklist-p-500.png" -o images/resources/webflow-checklist-500.png

# Download home office image
echo "Downloading home office image..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4f59d7f784e715fe3209f_DSC01457.jpg" -o images/home-office.jpg
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4f59d7f784e715fe3209f_DSC01457-p-500.jpg" -o images/home-office-500.jpg
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4f59d7f784e715fe3209f_DSC01457-p-800.jpg" -o images/home-office-800.jpg
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4f59d7f784e715fe3209f_DSC01457-p-1080.jpg" -o images/home-office-1080.jpg
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4f59d7f784e715fe3209f_DSC01457-p-1600.jpg" -o images/home-office-1600.jpg
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64d4f59d7f784e715fe3209f_DSC01457-p-2000.jpg" -o images/home-office-2000.jpg

# Download work feature images
echo "Downloading work section images..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60d1d2c28f657c1330eacf18_phoneTablet-p-500.webp" -o images/work/phone-tablet-500.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60d1d2c28f657c1330eacf18_phoneTablet.webp" -o images/work/phone-tablet.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60d1d2c3ad415774f138af15_iMac-p-500.webp" -o images/work/imac-500.webp
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60d1d2c3ad415774f138af15_iMac.webp" -o images/work/imac.webp

# Download social icons
echo "Downloading social icons..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/60cee337d1b31b70458c00ae_youtube.svg" -o images/social/youtube.svg
curl -L "https://cdn.prod.website-files.com/5f55d7011f80e60157323594/5f55d7029dcf98cddb967648_twitter.svg" -o images/social/twitter.svg
curl -L "https://cdn.prod.website-files.com/5f55d7011f80e60157323594/5f55d7029dcf989bd996766e_instagram.svg" -o images/social/instagram.svg

# Download Lottie animation
echo "Downloading Lottie animation..."
curl -L "https://cdn.prod.website-files.com/60c5f64abe141da7260da0b9/64f9ecc895b3fdd4892d843a_RH.json" -o images/icons/logo-animation.json

echo "Download complete! Check the images/ directory."
echo ""
echo "Total files downloaded:"
find images -type f | wc -l
