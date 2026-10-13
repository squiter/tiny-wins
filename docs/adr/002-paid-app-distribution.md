# ADR-002: Paid official app download

Status: accepted. Date: 2026-10-13.

The official iOS binary will use a one-time paid App Store download. All features are available after installation. No RevenueCat, StoreKit purchase flow, entitlement check, subscription, license service or purchase authentication exists in app code.

Before submission, the Account Holder must enroll/configure App Store Connect, accept the Paid Apps Agreement, supply tax/banking information and configure pricing/territories. Prepare final bundle ID, signing, app icon/screenshots, privacy disclosures and support URL. Recheck current policies at release. Price, license and trademark policy remain owner decisions. Source builds and official store distribution have separate concerns; no perpetual updates are promised. A later Android paid listing requires its own policy and purchase decisions.

Apple sources checked during bootstrap:

- https://developer.apple.com/help/app-store-connect/manage-app-pricing/set-a-price/
- https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements/
