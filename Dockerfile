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

# Configure Apache to serve from public folder
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Configure Apache for Render (dynamic port) - use port 8080
RUN echo 'Listen 8080' > /etc/apache2/ports.conf
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/*.conf

# Start Apache on port 8080
CMD sed -i 's/8080/${PORT:-8080}/g' /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf && apache2-foreground