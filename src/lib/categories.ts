import {
  faCar,
  faCat,
  faComputer,
  faGift,
  faGuitar,
  faHouse,
  faMusic,
  faPaperclip,
  faShirt,
  faStore,
  faTableTennisPaddleBall,
  faTv,
} from "@fortawesome/free-solid-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export const CATEGORIES = [
  "All",
  "Electronics",
  "Vehicles",
  "Apparel",
  "Home & Garden",
  "Sporting Goods",
  "Toys & Games",
  "Pet Supplies",
  "Musical Instruments",
  "Office Supplies",
  "Free Stuff",
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_ICONS: Record<string, IconDefinition> = {
  All: faStore,
  Electronics: faComputer,
  Vehicles: faCar,
  Apparel: faShirt,
  "Home & Garden": faHouse,
  "Sporting Goods": faTableTennisPaddleBall,
  "Toys & Games": faTv,
  "Pet Supplies": faCat,
  "Musical Instruments": faGuitar,
  "Office Supplies": faPaperclip,
  "Free Stuff": faGift,
}
