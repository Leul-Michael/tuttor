import { createContext, ReactNode, useContext } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { v4 as uuidv4 } from "uuid"

type RecentSearchProp = {
  id: string
  title: string
  location: string
}

type RecentSearchContextProps = {
  recentSearch: RecentSearchProp[]
  addRecentSearch: (title: string, location: string) => void
  removeRecentSearch: (id: string) => void
}

const RecentSearchContext = createContext({} as RecentSearchContextProps)

export default function useRecentSearch() {
  return useContext(RecentSearchContext)
}

export function RecentSearchContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [recentSearch, setRecentSearch] = useLocalStorage<RecentSearchProp[]>(
    "recent-search",
    []
  )

  function addRecentSearch(title: string, location: string) {
    if (!title && !location) return
    setRecentSearch((prev) => {
      if (
        prev.find((v) => v["title"] === title && v["location"] === location)
      ) {
        return prev
      } else {
        return [
          ...prev,
          {
            id: uuidv4(),
            title: title,
            location: location,
          },
        ]
      }
    })
  }

  function removeRecentSearch(id: string) {
    setRecentSearch((prev) => {
      return prev.filter((search: RecentSearchProp) => search["id"] !== id)
    })
  }

  return (
    <RecentSearchContext.Provider
      value={{ recentSearch, addRecentSearch, removeRecentSearch }}
    >
      {children}
    </RecentSearchContext.Provider>
  )
}
