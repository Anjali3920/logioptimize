import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./Layout";
import { CodePage } from "./pages/CodePage";
import { DPPage } from "./pages/DPPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DivideConquerPage } from "./pages/DivideConquerPage";
import { PerformancePage } from "./pages/PerformancePage";
import { RoutesPage } from "./pages/RoutesPage";
import { SortingPage } from "./pages/SortingPage";
import { VehiclesPage } from "./pages/VehiclesPage";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});
const sortingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sorting",
  component: SortingPage,
});
const routesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/routes",
  component: RoutesPage,
});
const vehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vehicles",
  component: VehiclesPage,
});
const dpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dp",
  component: DPPage,
});
const divideConquerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/divide-conquer",
  component: DivideConquerPage,
});
const performanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/performance",
  component: PerformancePage,
});
const codeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/code",
  component: CodePage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  sortingRoute,
  routesRoute,
  vehiclesRoute,
  dpRoute,
  divideConquerRoute,
  performanceRoute,
  codeRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
