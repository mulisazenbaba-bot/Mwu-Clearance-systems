#!/bin/bash
echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "Setting up storage permissions..."
chmod -R 775 storage bootstrap/cache

echo "Generating application key..."
php artisan key:generate --force

echo "Build completed!"