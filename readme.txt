=== Paidy for WooCommerce ===
Contributors: shohei.tanaka, artisan-workshop-1
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=info@artws.info&item_name=Donation+for+Artisan&currency_code=JPY
Tags: woocommerce, ecommerce, japanese, payment, paidy
Requires at least: 5.0
Tested up to: 6.8.3
Stable tag: 2.0.0
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Paidy for WooCommerce

== Description ==

This plugin extends the WooCommerce shop plugin for Paidy in Japan.
* If ["Japanized for WooCommerce"](https://wordpress.org/plugins/woocommerce-for-japan/) is installed, you do not need to install this plug-in separately.

= About Paidy =

Pre-registration not required / Credit card not required / Easy / Reliable / Payment is convenient settlement.
Shop with just your email address and mobile number.

= Payments are collected in the following month (convenience store / direct debit / bank transfer) completely paperless =

No matter how many times you shop a month, you can pay once. Billing information will be sent by email and SMS every month from the 1st to the 3rd. Payment can be made by convenience store, ATM, or direct debit by the 10th. You can check your shopping and payments on MyPaidy (web and app).

= Application required for use =

[Click here to apply](https://campaign.paidy.com/woocommerce)
* Be sure to select "Other" in the cart selection field and enter "WooCommerce"

= 100% payment guarantee =

Regardless of the customer's payment status, we guarantee payment to member stores.

= Key Features =

1. Paidy Payment checkout.
2. Webhook method.
3. Cooperation between Paidy and WooCommerce.

= External Services =

This plugin connects to the following third-party services:

* **Paidy payment API** (api.paidy.com) — used by the Paidy payment gateway to verify a payment after checkout and to capture, cancel and refund it when the order status changes. The Paidy payment ID, the order amount and the merchant's Paidy secret key are sent. Only active for orders paid with Paidy while the gateway is enabled. See [Paidy's terms of service](https://terms.paidy.com/) and privacy policy on Paidy's own site.
* **Paidy Checkout** (apps.paidy.com) — the Paidy Checkout script is loaded in the customer's browser on the order-pay page whenever this plugin is active. Order data is passed to it only when the customer pays with Paidy and the gateway is enabled: the order items and amount, the customer's name, e-mail address, phone number and shipping address, a summary of the customer's order history in this store (number of orders, total spent, amount and date of the last order), and the merchant's Paidy public key are sent to Paidy to start the payment.
* **Artisan Workshop Paidy onboarding intermediary** (paidy.artws.info) — used only while applying for a Paidy merchant account through this plugin's setup wizard (available before the gateway is enabled, since onboarding is how it becomes eligible to be enabled). Submitting the application form sends the store's site name and URL, the merchant's contact details (e-mail, phone), the representative's name and date of birth, the submitted screening survey answers, a site-specific verification hash and the plugin version to this Artisan Workshop-operated intermediary, which relays the application to Paidy and later delivers the issued API credentials back to the site. The intermediary also calls the site once to confirm that the Paidy webhook URL is reachable.

== Installation ==

Implement postpaid payment in WooCommerce with Paidy.

= Minimum Requirements =

* WordPress 5.0 or greater
* WooCommerce 3.0 or greater
* PHP version 7 or greater
* MySQL version 5.6 or greater

= Automatic installation =

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don’t need to leave your web browser. To do an automatic install of Woo sbp, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type “Paidy for WooCommerce” and click Search Plugins. Once you’ve found our eCommerce plugin you can view details about it such as the the point release, rating and description. Most importantly of course, you can install it by simply clicking “Install Now”.

= Manual installation =
The manual installation method involves downloading our plugin and uploading it to your webserver via your favourite FTP application.

== Frequently Asked Questions ==
Q: Can I use it as soon as I install the plugin?<br />
A: No, after application, it becomes available after providing information such as exam environment. In addition, examination is necessary for production environment use.<br />


== Screenshots ==


== Changelog ==

= 2.0.0 - 2026-10-22 =
* Security - The Paidy webhook (`paidy/v1/order`) now authenticates every request with the `x-paidy-signature` HMAC-SHA256 signature or, when no signature is sent, with the Paidy sender IP allowlist, and confirms an `authorize_success` with the Paidy API before completing the order. Previously anyone who knew an order number could mark a pending Paidy order as paid (#39)
* Security - The onboarding key-delivery endpoint (`paidy-receiver/v1/receive`) now requires the one-time state token issued by the setup wizard or an HMAC-SHA256 signature, rejects callbacks for an application other than the current one, and processes each callback only once. Secret keys are no longer kept in the diagnostic `paidy_received_data` option or returned in the response (#41)
* Security - The thank-you page confirms the transaction ID with the Paidy API (ID, order reference, amount and status) before completing the order, instead of trusting the `transaction_id` URL parameter (#42)
* Security - The transaction ID is validated against the Paidy payment ID format and URL-encoded before it is put into the cancel, capture and refund API URLs. For an ID that does not match, no request is sent to Paidy and an order note is added (#45)
* Fixed - Paidy payment verification always failed (HTTP 404) because `GET /payments/{id}` was sent as POST (#39)
* Fixed - Paidy Checkout failed to open for orders with a zero-discount coupon such as free shipping, a line item whose product had been deleted, or a fee name containing a line break or backslash. The order items are now passed to Paidy as JSON (#45)
* Fixed - A connection error or timeout on a cancel, capture or refund request caused a fatal error, and a refund answered without a status was recorded as refunded. These requests now count as successful only when Paidy returns the payment as closed (#45)
* Fixed - Applying for Paidy again through the setup wizard sent the application without the site hash, so the API keys could not be delivered automatically (#45)
* Fixed - Changing a Paidy order from Processing to Cancelled sent the cancel request to Paidy up to three times and left "cancellation not completed" order notes, and a capture, failed capture or refund was likewise sent more than once. These callbacks now run once per order status change (#42, #46)
* Fixed - A second partial refund of a Paidy order failed, and changing a partly refunded order from Completed to Cancelled did not refund the rest. Every refund is now sent to Paidy, and the refund on cancellation refunds only the remaining amount and is recorded as a WooCommerce refund (#46)
* Fixed - In the Checkout block, a customer who came back from Paidy Checkout after Paidy declined the payment saw no message, and the classic checkout showed it twice (#47)
* Fixed - The Paidy payment script was printed twice on the order-pay page and the Paidy settings were saved twice, because the webhook endpoint created its own copy of the gateway on every request (#47)
* Fixed - Signed Paidy webhooks in sandbox mode were verified with the live secret key instead of the test secret key (#47)
* Fixed - With debug mode on, the URL of the capture request was not written to the log, unlike the cancel and refund requests (#47)
* Fixed - A request that was running while the plugin was being updated could stop with a fatal error (#47)
* Fixed - Unbalanced HTML in the admin-edited Paidy description duplicated the place-order row on every classic-checkout update (#42)
* Fixed - The Paidy order lookup on the checkout picked up orders of unrelated guests; guest orders are no longer looked up, and the result for a logged-in customer is cached for 5 minutes (#42)
* Fixed - `wizard=false` now shows the manual configuration fields of the Paidy gateway, and the wizard no longer rewrites the `pk_test_` prefix of the saved test public key (#41)
* Dev - Removed `WC_Gateway_Paidy::checkout_reject_to_cancel()` and `WC_Paidy_Endpoint::$paidy`. The order status callbacks (capture, cancel, refund) and the checkout return handlers are registered once by `WC_Gateway_Paidy::register_order_status_hooks()` and `register_checkout_return_hooks()` instead of in the gateway constructor (#46, #47)

= 1.5.2 - 2025-11-04 =
* Fixed - Some bugs Fixed.

= 1.5.1 - 2025-08-06 =
* Tweak - Code tweaks for integration with Japanized for WooCommerce.

= 1.5.0 - 2025-07-30 =
* Dev - Payment application wizard function added.
* Fixed - Some bugs Fixed.
