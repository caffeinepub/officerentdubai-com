import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteLayout from './components/layout/SiteLayout';
import PublicListingsPage from './pages/PublicListingsPage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import AgentArenaEntryPage from './pages/agent/AgentArenaEntryPage';
import AgentDashboardPage from './pages/agent/AgentDashboardPage';
import ManagePropertiesPage from './pages/agent/ManagePropertiesPage';
import PropertyEditorPage from './pages/agent/PropertyEditorPage';

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicListingsPage
});

const listingDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listing/$id',
  component: ListingDetailsPage
});

const agentEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent',
  component: AgentArenaEntryPage
});

const agentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent/dashboard',
  component: AgentDashboardPage
});

const managePropertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent/properties',
  component: ManagePropertiesPage
});

const propertyEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent/properties/new',
  component: PropertyEditorPage
});

const propertyEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent/properties/edit/$id',
  component: PropertyEditorPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  listingDetailsRoute,
  agentEntryRoute,
  agentDashboardRoute,
  managePropertiesRoute,
  propertyEditorRoute,
  propertyEditRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
