FROM php:8.3-apache-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl unzip libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" mysqli pdo_mysql gd zip mbstring opcache \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /var/www/healthytrack
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader \
    && composer check-platform-reqs --no-dev
COPY config/ ./config/
COPY helpers/ ./helpers/
COPY controllers/ ./controllers/
COPY database/ ./database/
COPY public/ ./public/
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/healthytrack.ini
COPY docker/start.sh /usr/local/bin/healthytrack-start
RUN chmod +x /usr/local/bin/healthytrack-start \
    && mkdir -p /tmp/healthytrack-sessions \
    && chown www-data:www-data /tmp/healthytrack-sessions \
    && chmod 700 /tmp/healthytrack-sessions
ENV APP_ENV=production PORT=10000
EXPOSE 10000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD curl --fail --silent "http://127.0.0.1:${PORT}/health" || exit 1
CMD ["healthytrack-start"]
