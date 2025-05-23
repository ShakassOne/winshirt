
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Lotteries from "./pages/Lotteries";
import ProductDetail from "./pages/ProductDetail";
import LotteryDetail from "./pages/LotteryDetail";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import LotteriesAdmin from "./pages/admin/LotteriesAdmin";
import MockupsAdmin from "./pages/admin/MockupsAdmin";
import DesignsAdmin from "./pages/admin/DesignsAdmin";
import ThemeSettings from "./pages/admin/ThemeSettings";
import { useScrollReset } from "./hooks/useScrollReset";
import { ThemeProvider } from "./components/theme-provider";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./hooks/useAuth";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import OrderDetails from "./pages/OrderDetails";

// ScrollToTop component to reset scroll position
const ScrollToTop = () => {
  useScrollReset();
  return null;
};

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/lotteries" element={<Lotteries />} />
                <Route path="/lotteries/:id" element={<LotteryDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/:orderId" element={<Payment />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/account" element={<Account />} />
                <Route path="/order-details/:orderId" element={<OrderDetails />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ProductsAdmin />} />
                <Route path="/admin/lotteries" element={<LotteriesAdmin />} />
                <Route path="/admin/mockups" element={<MockupsAdmin />} />
                <Route path="/admin/designs" element={<DesignsAdmin />} />
                <Route path="/admin/theme" element={<ThemeSettings />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
