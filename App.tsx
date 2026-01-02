import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useAppContext } from './src/context/AppContext';

// Customer screens
import { CustomerSplash } from './src/components/customer/CustomerSplash';
import { CustomerLogin } from './src/components/customer/CustomerLogin';
import { CustomerDashboard } from './src/components/customer/CustomerDashboard';
import { PostTask } from './src/components/customer/PostTask';
import { BiddingScreen } from './src/components/customer/BiddingScreen';
import { WorkerProfileView } from './src/components/customer/WorkerProfileView';
import { ChatScreen } from './src/components/customer/ChatScreen';
import { JobTracking } from './src/components/customer/JobTracking';
import { LiveJobTracking } from './src/components/customer/LiveJobTracking';
import { PaymentScreen } from './src/components/customer/PaymentScreen';
import { RatingReview } from './src/components/customer/RatingReview';
import { CustomerProfile } from './src/components/customer/CustomerProfile';
import { CustomerMyJobs } from './src/components/customer/CustomerMyJobs';

// Worker screens
import { WorkerLogin } from './src/components/worker/WorkerLogin';
import { AvailableJobs } from './src/components/worker/AvailableJobs';
import { JobDetail } from './src/components/worker/JobDetail';
import { BidSubmission } from './src/components/worker/BidSubmission';
import { OngoingJobs } from './src/components/worker/OngoingJobs';
import { WorkerLiveTracking } from './src/components/worker/WorkerLiveTracking';
import { EarningsHistory } from './src/components/worker/EarningsHistory';
import { WorkerProfile } from './src/components/worker/WorkerProfile';
import { WorkerReviewScreen } from './src/components/worker/WorkerReviewScreen';
import { WorkerMessages } from './src/components/worker/WorkerMessages';

// Admin screens
import { AdminDashboard } from './src/components/admin/AdminDashboard';
import { UserManagement } from './src/components/admin/UserManagement';
import { JobManagement } from './src/components/admin/JobManagement';
import { PaymentReport } from './src/components/admin/PaymentReport';
import { FeedbackDispute } from './src/components/admin/FeedbackDispute';

// Shared screens
import { PersonalInfoOverview } from './src/components/shared/PersonalInfoOverview';
import { EditName } from './src/components/shared/EditName';
import { EditEmail } from './src/components/shared/EditEmail';
import { EditPhone } from './src/components/shared/EditPhone';
import { EditAddress } from './src/components/shared/EditAddress';
import { ChangePassword } from './src/components/shared/ChangePassword';
import { LanguageSelection } from './src/components/shared/LanguageSelection';
import { HelpSupport } from './src/components/shared/HelpSupport';

function AppContent() {
  const context = useAppContext();

  const renderScreen = () => {
    switch (context.screen) {
      // Customer screens
      case 'customer-splash':
        return <CustomerSplash context={context} />;
      case 'customer-login':
        return <CustomerLogin context={context} />;
      case 'customer-dashboard':
        return <CustomerDashboard context={context} />;
      case 'post-task':
        return <PostTask context={context} />;
      case 'bidding':
        return <BiddingScreen context={context} />;
      case 'worker-profile-view':
        return <WorkerProfileView context={context} />;
      case 'chat':
        return <ChatScreen context={context} />;
      case 'job-tracking':
        return <JobTracking context={context} />;
      case 'live-tracking':
        return <LiveJobTracking context={context} />;
      case 'payment':
        return <PaymentScreen context={context} />;
      case 'rating-review':
        return <RatingReview context={context} />;
      case 'customer-profile':
        return <CustomerProfile context={context} />;
      case 'customer-my-jobs':
        return <CustomerMyJobs context={context} />;
      
      // Worker screens
      case 'worker-login':
        return <WorkerLogin context={context} />;
      case 'available-jobs':
        return <AvailableJobs context={context} />;
      case 'job-detail':
        return <JobDetail context={context} />;
      case 'bid-submission':
        return <BidSubmission context={context} />;
      case 'ongoing-jobs':
        return <OngoingJobs context={context} />;
      case 'worker-live-tracking':
        return <WorkerLiveTracking context={context} />;
      case 'earnings-history':
        return <EarningsHistory context={context} />;
      case 'worker-profile':
        return <WorkerProfile context={context} />;
      case 'worker-review':
        return <WorkerReviewScreen context={context} />;
      case 'worker-messages':
        return <WorkerMessages context={context} />;
      
      // Admin screens
      case 'admin-dashboard':
        return <AdminDashboard context={context} />;
      case 'user-management':
        return <UserManagement context={context} />;
      case 'job-management':
        return <JobManagement context={context} />;
      case 'payment-report':
        return <PaymentReport context={context} />;
      case 'feedback-dispute':
        return <FeedbackDispute context={context} />;
      
      // Shared screens
      case 'personal-info':
        return <PersonalInfoOverview context={context} />;
      case 'edit-name':
        return <EditName context={context} />;
      case 'edit-email':
        return <EditEmail context={context} />;
      case 'edit-phone':
        return <EditPhone context={context} />;
      case 'edit-address':
        return <EditAddress context={context} />;
      case 'change-password':
        return <ChangePassword context={context} />;
      case 'language-selection':
        return <LanguageSelection context={context} />;
      case 'help-support':
        return <HelpSupport context={context} />;
      
      default:
        return <CustomerSplash context={context} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {renderScreen()}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
