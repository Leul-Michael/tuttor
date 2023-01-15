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
    (node: HTMLDivElement) => {
      if (isFetchingNextPage || isLoading) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((elems) => {
        if (elems[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (node) intObserver.current?.observe(node)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage, isLoading]
  )

  return lastPostRef
}
