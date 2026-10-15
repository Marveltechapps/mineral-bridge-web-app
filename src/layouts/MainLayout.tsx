import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { TradeNav } from '@/components/layout/TradeNav';
import { KycBanner } from '@/components/layout/KycBanner';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/common/Modal';
import { HowItWorksOverlay } from '@/features/howItWorks/components/HowItWorksOverlay';
import { AuthOverlay } from '@/features/auth/components/AuthOverlay';
import { css } from '@/utils/css';

/**
 * Application chrome shared by every screen: sticky header, trade-desk bar,
 * verification banner, the routed page, the footer and the three overlays.
 */
export function MainLayout() {
  return (
    <>
      <div style={css('min-height:100vh; display:flex; flex-direction:column;')}>
        <Header />
        <TradeNav />
        <KycBanner />
        <main style={css('flex:1;')}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <HowItWorksOverlay />
      <AuthOverlay />
      <Modal />
    </>
  );
}
