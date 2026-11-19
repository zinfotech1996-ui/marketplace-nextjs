import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faCheck,
  faCircleExclamation,
  faImage,
  faList,
  faMagnifyingGlass,
  faSpinner,
  faTableCellsLarge,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import type { ComponentProps } from "react"

type IconProps = Omit<ComponentProps<typeof FontAwesomeIcon>, "icon">

function wrap(icon: (typeof faMagnifyingGlass)) {
  return function Icon(props: IconProps) {
    return <FontAwesomeIcon icon={icon} {...props} />
  }
}

export const SearchIcon = wrap(faMagnifyingGlass)
export const ImageIcon = wrap(faImage)
export const CloseIcon = wrap(faXmark)
export const SpinnerIcon = wrap(faSpinner)
export const AlertIcon = wrap(faCircleExclamation)
export const CheckIcon = wrap(faCheck)
export const ArrowLeftIcon = wrap(faArrowLeft)
export const GridIcon = wrap(faTableCellsLarge)
export const ListIcon = wrap(faList)
