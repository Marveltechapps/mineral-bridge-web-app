import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ROUTE_PATHS } from '@/constants/routes';
import { HomePage } from '@/features/home/pages/HomePage';
import { AuthPage } from '@/features/auth/pages/AuthPage';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { ProductPage } from '@/features/product/pages/ProductPage';
import { SellPage } from '@/features/sell/pages/SellPage';
import { MiningPage } from '@/features/mining/pages/MiningPage';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { AuctionsPage } from '@/features/auctions/pages/AuctionsPage';
import { AuctionDetailPage } from '@/features/auctions/pages/AuctionDetailPage';
import { AcademyPage } from '@/features/academy/pages/AcademyPage';
import { CoursePage } from '@/features/academy/pages/CoursePage';
import { HowItWorksPage } from '@/features/howItWorks/pages/HowItWorksPage';
import { KycPage } from '@/features/kyc/pages/KycPage';
import { AsmPage } from '@/features/asm/pages/AsmPage';
import { AccountPage } from '@/features/account/pages/AccountPage';
import { AccountEditPage } from '@/features/account/pages/AccountEditPage';
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage';
import { NegotiationPage } from '@/features/trade/pages/NegotiationPage';
import { ContractPage } from '@/features/trade/pages/ContractPage';
import { LcPage } from '@/features/trade/pages/LcPage';
import { BankPage } from '@/features/trade/pages/BankPage';
import { ShipmentPage } from '@/features/trade/pages/ShipmentPage';

/** Every screen of the design, each with its own URL. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTE_PATHS.home} element={<HomePage />} />
        <Route path={ROUTE_PATHS.auth} element={<AuthPage />} />
        <Route path={ROUTE_PATHS.buy} element={<CatalogPage />} />
        <Route path={ROUTE_PATHS.product} element={<ProductPage />} />
        <Route path={ROUTE_PATHS.sell} element={<SellPage />} />
        <Route path={ROUTE_PATHS.mining} element={<MiningPage />} />
        <Route path={ROUTE_PATHS.orders} element={<OrdersPage />} />
        <Route path={ROUTE_PATHS.auctions} element={<AuctionsPage />} />
        <Route path={ROUTE_PATHS.auctionDetail} element={<AuctionDetailPage />} />
        <Route path={ROUTE_PATHS.academy} element={<AcademyPage />} />
        <Route path={ROUTE_PATHS.course} element={<CoursePage />} />
        <Route path={ROUTE_PATHS.howItWorks} element={<HowItWorksPage />} />
        <Route path={ROUTE_PATHS.kyc} element={<KycPage />} />
        <Route path={ROUTE_PATHS.asm} element={<AsmPage />} />
        <Route path={ROUTE_PATHS.account} element={<AccountPage />} />
        <Route path={ROUTE_PATHS.accEdit} element={<AccountEditPage />} />
        <Route path={ROUTE_PATHS.orderDetail} element={<OrderDetailPage />} />
        <Route path={ROUTE_PATHS.negotiation} element={<NegotiationPage />} />
        <Route path={ROUTE_PATHS.contract} element={<ContractPage />} />
        <Route path={ROUTE_PATHS.lc} element={<LcPage />} />
        <Route path={ROUTE_PATHS.bank} element={<BankPage />} />
        <Route path={ROUTE_PATHS.shipment} element={<ShipmentPage />} />
        <Route path="*" element={<Navigate to={ROUTE_PATHS.home} replace />} />
      </Route>
    </Routes>
  );
}
