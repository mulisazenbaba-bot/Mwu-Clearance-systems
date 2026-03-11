FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpq-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set workdir
WORKDIR /var/www/html

# Copy app
COPY backend/ .

# Install deps
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Start Apache
CMD ["apache2-foreground"]