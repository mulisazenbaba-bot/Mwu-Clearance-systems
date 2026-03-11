#!/bin/bash

# Set port from environment variable or default to 8080
PORT=${PORT:-8080}

# Update Apache configuration with the actual port
sed -i "s/8080/${PORT}/g" /etc/apache2/ports.conf
sed -i "s/8080/${PORT}/g" /etc/apache2/sites-available/*.conf

# Start Apache
exec apache2-foreground