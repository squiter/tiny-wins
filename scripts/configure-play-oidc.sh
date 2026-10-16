#!/usr/bin/env bash
# One-time Google setup. Run with the owner's authenticated gcloud / Cloud Shell.
# Creates no service-account key, paid compute resource, or billing link.
set -euo pipefail
: "${TW_GOOGLE_PROJECT_ID:?Set the owner-selected Google Cloud project ID}"
: "${TW_CONFIRM_GOOGLE_SETUP:?Set yes after reviewing the documented access grants}"
[[ "$TW_CONFIRM_GOOGLE_SETUP" == yes ]] || exit 1
[[ "$TW_GOOGLE_PROJECT_ID" =~ ^[a-z][a-z0-9-]{4,28}[a-z0-9]$ ]] || exit 1
project="$TW_GOOGLE_PROJECT_ID"
project_number="$(gcloud projects describe "$project" --format='value(projectNumber)')"
[[ "$project_number" =~ ^[0-9]+$ ]] || exit 1
pool=tiny-wins-github
provider=android-release
account=tiny-wins-play
service_account="$account@$project.iam.gserviceaccount.com"
gcloud services enable iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com androidpublisher.googleapis.com --project="$project"
if ! gcloud iam service-accounts describe "$service_account" --project="$project" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$account" --display-name='Tiny Wins Play internal releases' --project="$project"
fi
if ! gcloud iam workload-identity-pools describe "$pool" --location=global --project="$project" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$pool" --location=global --display-name='Tiny Wins GitHub releases' --project="$project"
fi
condition="assertion.repository_id == '1418132621' && assertion.repository_owner_id == '238017' && assertion.ref.startsWith('refs/tags/android-v') && assertion.workflow_ref.startsWith('squiter/tiny-wins/.github/workflows/android-release.yml@refs/tags/android-v') && assertion.sub == 'repo:squiter/tiny-wins:environment:android-publish'"
mapping='google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.repository_owner_id=assertion.repository_owner_id'
if gcloud iam workload-identity-pools providers describe "$provider" --workload-identity-pool="$pool" --location=global --project="$project" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc "$provider" --workload-identity-pool="$pool" --location=global --issuer-uri=https://token.actions.githubusercontent.com --attribute-mapping="$mapping" --attribute-condition="$condition" --project="$project"
else
  gcloud iam workload-identity-pools providers create-oidc "$provider" --workload-identity-pool="$pool" --location=global --issuer-uri=https://token.actions.githubusercontent.com --attribute-mapping="$mapping" --attribute-condition="$condition" --project="$project"
fi
gcloud iam service-accounts add-iam-policy-binding "$service_account" --role=roles/iam.workloadIdentityUser --member="principalSet://iam.googleapis.com/projects/$project_number/locations/global/workloadIdentityPools/$pool/attribute.repository_id/1418132621" --project="$project"
printf 'GOOGLE_WORKLOAD_IDENTITY_PROVIDER=projects/%s/locations/global/workloadIdentityPools/%s/providers/%s\n' "$project_number" "$pool" "$provider"
printf 'GOOGLE_PLAY_SERVICE_ACCOUNT=%s\n' "$service_account"
printf '%s\n' 'Next: grant this identity app-specific internal-testing permissions in Play Console. Do not grant admin/financial/production access. Enable publishing only after first-app setup and a pilot update test.'
