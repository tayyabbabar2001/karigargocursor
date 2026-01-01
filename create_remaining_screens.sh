#!/bin/bash
# Create placeholder screens for worker, admin, and shared

# Worker screens
for screen in WorkerLogin AvailableJobs JobDetail BidSubmission OngoingJobs WorkerLiveTracking EarningsHistory WorkerProfile WorkerReviewScreen; do
  touch "src/components/worker/${screen}.tsx"
done

# Admin screens  
for screen in AdminDashboard UserManagement JobManagement PaymentReport FeedbackDispute; do
  touch "src/components/admin/${screen}.tsx"
done

# Shared screens
for screen in PersonalInfoOverview EditName EditAddress ChangePassword LanguageSelection HelpSupport; do
  touch "src/components/shared/${screen}.tsx"
done
