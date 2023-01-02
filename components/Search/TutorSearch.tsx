import { useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdLocationOn } from "react-icons/md"
import SearchStyles from "../../styles/Search.module.css"
import SelectCheckbox, { Option } from "../Select/SelectCheckbox"

const CategoriyOptions = [
  { key: 1, value: "Home" },
  { key: 2, value: "Online" },
  { key: 3, value: "Remote" },
]
const LevelOptions = [
  { key: 1, value: "KG" },
  { key: 2, value: "Elemntary" },
  { key: 3, value: "Preparatory" },
  { key: 4, value: "University" },
]
const PriceOptions = [
  { key: 1, value: "150+/hr" },
  { key: 2, value: "300+/hr" },
  { key: 3, value: "500+/hr" },
]

export default function TutorSearch() {
  const [values, setValues] = useState<Option[]>(CategoriyOptions)
  const [levels, setLevels] = useState<Option[]>(LevelOptions)
  const [price, setPrice] = useState<Option[]>(PriceOptions)

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
  const onLevelsChange = (value: Option) => {
    if (levels.includes(value)) {
      setLevels((prev) => {
        return prev.filter((v) => v !== value)
      })
    } else {
      setLevels((prev) => [...prev, value])
    }
  }

  return (
    <section className={SearchStyles.container}>
      <div className="container">
        <h1 className="font-serif main-title">Find the best Tutor.</h1>
        <div className={SearchStyles["search-container"]}>
          <div className={SearchStyles["input-box"]}>
            <label htmlFor="title">Who</label>
            <input type="text" placeholder="name" id="name" name="name" />
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
            />
            <MdLocationOn className={SearchStyles.icon} />
          </div>
          <button className={`btn btn-primary`}>Find</button>
        </div>
      </div>
      <div className={`${SearchStyles.filters} container`}>
        <SelectCheckbox
          options={CategoriyOptions}
          values={values}
          onChange={onValuesChange}
          name="Categories"
        />
        <SelectCheckbox
          options={LevelOptions}
          values={levels}
          onChange={onLevelsChange}
          name="Levels"
        />
        <SelectCheckbox
          options={PriceOptions}
          values={price}
          onChange={onPriceChange}
          name="Price"
        />
      </div>
    </section>
  )
}
