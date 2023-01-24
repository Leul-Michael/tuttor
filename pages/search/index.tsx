import { useState, useRef, FormEvent } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdLocationOn } from "react-icons/md"
import SearchStyles from "../../styles/Search.module.css"
import SelectCheckbox, { Option } from "../../components/Select/SelectCheckbox"
import { useRouter } from "next/router"
import { useInfiniteQuery } from "@tanstack/react-query"
import axiosInstance from "../../axios/axios"
import SearchFeed from "../../components/Search/SearchFeed"
import useLastPostRef from "../../hooks/useLastPostRef"
import useRecentSearch from "../../context/RecentSearchContext"
import Head from "next/head"

const CategoriyOptions = [
  { key: 1, value: "Home" },
  { key: 2, value: "Online" },
  { key: 3, value: "Both" },
]
// const LevelOptions = [
//   { key: 1, value: "KG" },
//   { key: 2, value: "Elemntary" },
//   { key: 3, value: "Preparatory" },
//   { key: 4, value: "University" },
// ]
const PriceOptions = [
  { key: 1, value: "150+/hr" },
  { key: 2, value: "300+/hr" },
  { key: 3, value: "500+/hr" },
]

export default function Search() {
  const router = useRouter()
  const { addRecentSearch } = useRecentSearch()

  const [values, setValues] = useState<Option[]>(CategoriyOptions)
  //   const [levels, setLevels] = useState<Option[]>(LevelOptions)
  const [price, setPrice] = useState<Option[]>(PriceOptions)

  const titleRef = useRef<HTMLInputElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)

  const onValuesChange = (value: Option) => {
    if (values.includes(value)) {
      setValues((prev) => {
        return prev.filter((v) => v !== value)
      })
    } else {
      setValues((prev) => [...prev, value])
    }
  }

  const onPriceChange = (value: Option) => {
    if (price.includes(value)) {
      setPrice((prev) => {
        return prev.filter((v) => v !== value)
      })
    } else {
      setPrice((prev) => [...prev, value])
    }
  }

  // DRY
  //   const onLevelsChange = (value: Option) => {
  //     if (levels.includes(value)) {
  //       setLevels((prev) => {
  //         return prev.filter((v) => v !== value)
  //       })
  //     } else {
  //       setLevels((prev) => [...prev, value])
  //     }
  //   }

  const {
    data,
    refetch,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get("/search/jobs", {
        params: {
          pageParam,
          title: titleRef.current?.value,
          location: locationRef.current?.value,
        },
      })
      return res.data
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? parseInt(lastPage?.pageParam) + 1 : undefined
    },
  })

  const lastPostRef = useLastPostRef(
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage
  )
  const refetchQuery = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addRecentSearch(
      titleRef.current?.value || "",
      locationRef.current?.value || ""
    )
    refetch()
  }

  return (
    <>
      <Head>
        <title>Search for tutoring job</title>
        <meta
          name="description"
          content="Find jobs bsaed on keywords and location."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={SearchStyles.container}>
        <div className="container">
          <form
            onSubmit={refetchQuery}
            className={SearchStyles["search-container"]}
          >
            <div className={SearchStyles["input-box"]}>
              <label htmlFor="title">What</label>
              <input
                type="text"
                placeholder="title, keywords"
                id="title"
                name="title"
                ref={titleRef}
                defaultValue={router.query?.title}
              />
              <AiOutlineSearch className={SearchStyles.icon} />
            </div>
            <div className={SearchStyles["input-box"]}>
              <label htmlFor="title">Where</label>
              <input
                type="text"
                placeholder="location"
                id="location"
                name="location"
                autoComplete="off"
                ref={locationRef}
                defaultValue={router.query?.location}
              />
              <MdLocationOn className={SearchStyles.icon} />
            </div>
            <button className={`btn btn-primary`}>Find job</button>
          </form>
        </div>
        <div className={`${SearchStyles.filters} container`}>
          <SelectCheckbox
            options={CategoriyOptions}
            values={values}
            onChange={onValuesChange}
            name="Categories"
          />
          {/* <SelectCheckbox
          options={LevelOptions}
          values={levels}
          onChange={onLevelsChange}
          name="Levels"
        /> */}
          <SelectCheckbox
            options={PriceOptions}
            values={price}
            onChange={onPriceChange}
            name="Price"
          />
        </div>
      </section>
      <SearchFeed
        data={data}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        lastPostRef={lastPostRef}
      />
    </>
  )
}
