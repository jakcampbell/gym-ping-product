import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL as string | undefined;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(220,90%,56%)",
    colorForeground: "hsl(220,15%,15%)",
    colorMutedForeground: "hsl(220,10%,55%)",
    colorDanger: "hsl(0,84%,60%)",
    colorBackground: "hsl(0,0%,100%)",
    colorInput: "hsl(220,20%,97%)",
    colorInputForeground: "hsl(220,15%,15%)",
    colorNeutral: "hsl(220,15%,88%)",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[hsl(220,15%,15%)] font-bold",
    headerSubtitle: "text-[hsl(220,10%,55%)]",
    socialButtonsBlockButtonText: "text-[hsl(220,15%,15%)] font-medium",
    formFieldLabel: "text-[hsl(220,15%,20%)] font-medium",
    footerActionLink: "text-[hsl(220,90%,56%)] font-semibold",
    footerActionText: "text-[hsl(220,10%,55%)]",
    dividerText: "text-[hsl(220,10%,55%)]",
    identityPreviewEditButton: "text-[hsl(220,90%,56%)]",
    formFieldSuccessText: "text-emerald-600",
    alertText: "text-[hsl(220,15%,15%)]",
    logoBox: "flex justify-center",
    logoImage: "h-10 w-10",
    socialButtonsBlockButton: "border border-[hsl(220,15%,88%)] hover:bg-[hsl(220,20%,97%)]",
    formButtonPrimary: "bg-[hsl(220,90%,56%)] hover:bg-[hsl(220,90%,50%)] text-white font-semibold",
    formFieldInput: "bg-[hsl(220,20%,97%)] border-[hsl(220,15%,85%)] text-[hsl(220,15%,15%)]",
    footerAction: "bg-[hsl(220,20%,97%)]",
    dividerLine: "bg-[hsl(220,15%,88%)]",
    alert: "bg-red-50",
    otpCodeFieldInput: "border-[hsl(220,15%,88%)] text-[hsl(220,15%,15%)]",
    formFieldRow: "",
    main: "",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[hsl(220,20%,97%)] px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[hsl(220,20%,97%)] px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function ProtectedDashboard() {
  return (
    <>
      <Show when="signed-in">
        <Dashboard />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to track your gym attendance",
          },
        },
        signUp: {
          start: {
            title: "Get started",
            subtitle: "Create your Gym Ping account",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/dashboard" component={ProtectedDashboard} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
