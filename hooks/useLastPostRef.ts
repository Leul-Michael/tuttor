import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query"
import { useCallback, useRef } from "react"

export default function useLastPostRef(
  isFetchingNextPage: boolean,
  isLoading: boolean,
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<any, unknown>>,
  hasNextPage: boolean | undefined
) {
  const intObserver = useRef<IntersectionObserver | null>(null)

  const lastPostRef = useCallback(
    (job: HTMLDivElement) => {
      if (isFetchingNextPage || isLoading) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (job) intObserver.current?.observe(job)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage, isLoading]
  )

  return lastPostRef
}
