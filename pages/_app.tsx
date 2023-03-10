import "../styles/globals.css"
import type { AppProps } from "next/app"
import Layout from "../components/Layout"
import { SessionProvider } from "next-auth/react"
import { ToastContextProvider } from "../context/ToastContext"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RecentSearchContextProvider } from "../context/RecentSearchContext"
import { DMContextProvider } from "../context/DMContext"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })
  return (
    <ToastContextProvider>
      <RecentSearchContextProvider>
        <SessionProvider
          session={session}
          refetchInterval={5 * 60 * 60}
          refetchOnWindowFocus={false}
        >
          <QueryClientProvider client={queryClient}>
            <DMContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </DMContextProvider>
          </QueryClientProvider>
        </SessionProvider>
      </RecentSearchContextProvider>
    </ToastContextProvider>
  )
}
