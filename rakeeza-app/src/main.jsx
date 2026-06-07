import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n.js'
import App from './App.jsx'
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { dark } from '@clerk/themes';
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#8b5cf6', // Matches secondary/accent in tailwind config
          fontFamily: "'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'",
          colorBackground: '#0f172a', // base-100 dark
          colorInputBackground: '#1e293b', // base-200 dark
          colorText: '#f8fafc', // base-content dark
          colorTextSecondary: '#94a3b8', // slate-400
        },
        elements: {
          card: "shadow-2xl border border-white/5",
          formButtonPrimary: "bg-accent text-white hover:opacity-90 active:scale-95 transition-all",
          socialButtonsBlockButton: "border-white/10 hover:bg-white/5",
        }
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
)
