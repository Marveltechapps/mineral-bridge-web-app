// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import { AccountTypeScreen } from './screens/AccountTypeScreen';
import { AuctionScreen } from './screens/AuctionScreen';
import { AuctionWonScreen } from './screens/AuctionWonScreen';
import { AuctionsScreen } from './screens/AuctionsScreen';
import { AuthScreen } from './screens/AuthScreen';
import { CancelScreen } from './screens/CancelScreen';
import { CartScreen } from './screens/CartScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { ChatScreen } from './screens/ChatScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { ContactOtpScreen } from './screens/ContactOtpScreen';
import { ContractScreen } from './screens/ContractScreen';
import { DocumentScreen } from './screens/DocumentScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { HelpScreen } from './screens/HelpScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InspectionReportsScreen } from './screens/InspectionReportsScreen';
import { KycDocumentScreen } from './screens/KycDocumentScreen';
import { KycScreen } from './screens/KycScreen';
import { KycStatusScreen } from './screens/KycStatusScreen';
import { KycSubmittedScreen } from './screens/KycSubmittedScreen';
import { PriceVariationScreen } from './screens/PriceVariationScreen';
import { LotsScreen } from './screens/LotsScreen';
import { NotificationChannelsScreen } from './screens/NotificationChannelsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { OrderPlacedScreen } from './screens/OrderPlacedScreen';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { OtpScreen } from './screens/OtpScreen';
import { PaymentDetailsScreen } from './screens/PaymentDetailsScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { QuotationScreen } from './screens/QuotationScreen';
import { ReceiptScreen } from './screens/ReceiptScreen';
import { RefundRequestScreen } from './screens/RefundRequestScreen';
import { RefundsScreen } from './screens/RefundsScreen';
import { RegistrationDetailsScreen } from './screens/RegistrationDetailsScreen';
import { SellCategoriesScreen } from './screens/SellCategoriesScreen';
import { SellFormScreen } from './screens/SellFormScreen';
import { SellSubmittedScreen } from './screens/SellSubmittedScreen';
import { SellerConfirmationScreen } from './screens/SellerConfirmationScreen';
import { ShipmentScreen } from './screens/ShipmentScreen';
import { SubcategoriesScreen } from './screens/SubcategoriesScreen';
import { SupportInboxScreen } from './screens/SupportInboxScreen';
import { SupportThreadScreen } from './screens/SupportThreadScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { ActionBar } from './shell/ActionBar';
import { AppHeader } from './shell/AppHeader';
import { BrandPanel } from './shell/BrandPanel';
import { OnboardingHeader } from './shell/OnboardingHeader';
import { ScreenRail } from './shell/ScreenRail';
import { Sheet } from './shell/Sheet';
import { Sidebar } from './shell/Sidebar';
import { SummaryAside } from './shell/SummaryAside';
import { Toast } from './shell/Toast';
import type { ViewModel } from '../../types/platform';
import { str } from '../../lib/platform/view';

export function AppShell({ vm }: { vm: ViewModel }) {
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', background: '#F4F2ED' }}>
        {vm.web?.app ? <Sidebar vm={vm} /> : null}
        {vm.web?.railOpen ? <ScreenRail vm={vm} /> : null}
        {vm.web?.onboard ? <BrandPanel vm={vm} /> : null}
        <div className="sc" style={{ flex: '1 1 50%', minWidth: '0', height: '100vh', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {vm.web?.app ? <AppHeader vm={vm} /> : null}
          {vm.web?.onboard ? <OnboardingHeader vm={vm} /> : null}
          <main style={{ flex: '1', width: '100%', padding: '28px 36px 0' }}>
            <div className="w5-row" style={{ maxWidth: str(vm.web?.w), margin: '0 auto', display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
              <div style={{ flex: '1', minWidth: '0' }}>
                {vm.is?.welcome ? <WelcomeScreen vm={vm} /> : null}
                {vm.is?.auth ? <AuthScreen vm={vm} /> : null}
                {vm.is?.otp ? <OtpScreen vm={vm} /> : null}
                {vm.showTypePicker ? <AccountTypeScreen vm={vm} /> : null}
                {vm.is?.regDetails ? <RegistrationDetailsScreen vm={vm} /> : null}
                {vm.is?.kyc ? <KycScreen vm={vm} /> : null}
                {vm.is?.kycDoc ? <KycDocumentScreen vm={vm} /> : null}
                {vm.is?.kycDone ? <KycSubmittedScreen vm={vm} /> : null}
                {vm.is?.home ? <HomeScreen vm={vm} /> : null}
                {vm.is?.cats ? <CategoriesScreen vm={vm} /> : null}
                {vm.is?.minerals ? <SubcategoriesScreen vm={vm} /> : null}
                {vm.is?.lots ? <LotsScreen vm={vm} /> : null}
                {vm.is?.detail ? <ProductDetailScreen vm={vm} /> : null}
                {vm.is?.cart ? <CartScreen vm={vm} /> : null}
                {vm.is?.checkout ? <CheckoutScreen vm={vm} /> : null}
                {vm.is?.placed ? <OrderPlacedScreen vm={vm} /> : null}
                {vm.is?.orders ? <OrdersScreen vm={vm} /> : null}
                {vm.is?.order ? <OrderTrackingScreen vm={vm} /> : null}
                {vm.is?.quote ? <QuotationScreen vm={vm} /> : null}
                {vm.is?.contract ? <ContractScreen vm={vm} /> : null}
                {vm.is?.payInsp ? <PaymentDetailsScreen vm={vm} /> : null}
                {vm.is?.sellConfirm ? <SellerConfirmationScreen vm={vm} /> : null}
                {vm.is?.report ? <InspectionReportsScreen vm={vm} /> : null}
                {vm.is?.pay ? <PaymentScreen vm={vm} /> : null}
                {vm.is?.receipt ? <ReceiptScreen vm={vm} /> : null}
                {vm.is?.chat ? <ChatScreen vm={vm} /> : null}
                {vm.is?.sellCats ? <SellCategoriesScreen vm={vm} /> : null}
                {vm.is?.sellForm ? <SellFormScreen vm={vm} /> : null}
                {vm.is?.sellDone ? <SellSubmittedScreen vm={vm} /> : null}
                {vm.is?.shipment ? <ShipmentScreen vm={vm} /> : null}
                {vm.is?.auctions ? <AuctionsScreen vm={vm} /> : null}
                {vm.is?.auction ? <AuctionScreen vm={vm} /> : null}
                {vm.is?.auctionWon ? <AuctionWonScreen vm={vm} /> : null}
                {vm.is?.priceVar ? <PriceVariationScreen vm={vm} /> : null}
                {vm.is?.cancel ? <CancelScreen vm={vm} /> : null}
                {vm.is?.refund ? <RefundRequestScreen vm={vm} /> : null}
                {vm.is?.refunds ? <RefundsScreen vm={vm} /> : null}
                {vm.is?.doc ? <DocumentScreen vm={vm} /> : null}
                {vm.is?.profile ? <ProfileScreen vm={vm} /> : null}
                {vm.is?.editProfile ? <EditProfileScreen vm={vm} /> : null}
                {vm.is?.contactOtp ? <ContactOtpScreen vm={vm} /> : null}
                {vm.is?.kycStatus ? <KycStatusScreen vm={vm} /> : null}
                {vm.is?.notifs ? <NotificationsScreen vm={vm} /> : null}
                {vm.is?.prefs ? <NotificationChannelsScreen vm={vm} /> : null}
                {vm.is?.help ? <HelpScreen vm={vm} /> : null}
                {vm.is?.support ? <SupportInboxScreen vm={vm} /> : null}
                {vm.is?.supportThread ? <SupportThreadScreen vm={vm} /> : null}
              </div>
              {vm.web?.split ? <SummaryAside vm={vm} /> : null}
            </div>
            {vm.web?.barCta ? <ActionBar vm={vm} /> : null}
          </main>
        </div>
      </div>
      {vm.toast ? <Toast vm={vm} /> : null}
      {vm.sheet?.open ? <Sheet vm={vm} /> : null}
    </>
  );
}
