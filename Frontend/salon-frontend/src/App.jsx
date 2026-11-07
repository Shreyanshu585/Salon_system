import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { FullscreenLoader } from "@/components/ui/FullscreenLoader";

const HomePage = lazy(() => import("@/pages/HomePage"));
const SalonsListPage = lazy(() => import("@/pages/SalonsListPage"));
const SalonDetailPage = lazy(() => import("@/pages/SalonDetailPage"));
const MyBookingsPage = lazy(() => import("@/pages/MyBookingsPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/PaymentSuccessPage"));
const PaymentCancelPage = lazy(() => import("@/pages/PaymentCancelPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));

const OwnerOverviewPage = lazy(() => import("@/pages/owner/OwnerOverviewPage"));
const OwnerSalonPage = lazy(() => import("@/pages/owner/OwnerSalonPage"));
const OwnerCategoriesPage = lazy(() => import("@/pages/owner/OwnerCategoriesPage"));
const OwnerServicesPage = lazy(() => import("@/pages/owner/OwnerServicesPage"));
const OwnerBookingsPage = lazy(() => import("@/pages/owner/OwnerBookingsPage"));
const OwnerNotificationsPage = lazy(() => import("@/pages/owner/OwnerNotificationsPage"));

const NotFoundPage = lazy(() => import("@/pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@/pages/errors/UnauthorizedPage"));
const ServerErrorPage = lazy(() => import("@/pages/errors/ServerErrorPage"));
const NetworkErrorPage = lazy(() => import("@/pages/errors/NetworkErrorPage"));

export default function App() {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/salons" element={<SalonsListPage />} />
          <Route path="/salons/:salonId" element={<SalonDetailPage />} />
          <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/payment-success/:orderId" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/server-error" element={<ServerErrorPage />} />
          <Route path="/network-error" element={<NetworkErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={["SALON_OWNER"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/owner" element={<OwnerOverviewPage />} />
          <Route path="/owner/salon" element={<OwnerSalonPage />} />
          <Route path="/owner/categories" element={<OwnerCategoriesPage />} />
          <Route path="/owner/services" element={<OwnerServicesPage />} />
          <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
          <Route path="/owner/notifications" element={<OwnerNotificationsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
