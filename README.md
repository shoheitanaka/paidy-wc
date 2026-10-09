# Paidy for WooCommerce

Paidy for WooCommerce is the Payment extension WordPress plugin. (for Japan)

This standalone plugin is extracted from the Paidy module of
[Japanized for WooCommerce](https://github.com/artisanworkshop/Japanized-for-WooCommerce), which is the upstream
source of the gateway code. If Japanized for WooCommerce is installed, this plugin is not needed.

## WordPress.org

- English: https://wordpress.org/plugins/paidy-wc/
- Japanese: https://ja.wordpress.org/plugins/paidy-wc/

## Development

```bash
composer install
npm install

npm run env:start        # wp-env: http://localhost:10150 (admin / password)
npm run build            # src/ -> includes/gateways/paidy/assets/js/

composer lint            # PHPCS (WordPress Coding Standards)
composer phpstan         # PHPStan level 5
composer test:db && composer test:install   # once: Docker MySQL + WordPress/WooCommerce test install
composer test            # PHPUnit
```

- Developer documentation (Japanese): [`docs/development.md`](docs/development.md),
  [`docs/architecture.md`](docs/architecture.md), [`docs/DEVELOPMENT_PLAN.md`](docs/DEVELOPMENT_PLAN.md)
- Syncing changes from Japanized for WooCommerce: [`docs/sync-with-jp4wc.md`](docs/sync-with-jp4wc.md)
- Instructions for AI coding assistants / reviewers: [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md)

### Translations

Text domain `paidy-wc`, files in `i18n/`. Japanese PHP strings are delivered by the WordPress.org language pack;
the JSON files for the React apps are bundled. See `.claude/skills/update-i18n/SKILL.md`.

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
