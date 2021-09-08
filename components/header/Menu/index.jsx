import Dinamicos from "./Dinamicos"
import Estaticos from "./Estaticos"

const Menu = ({ navItems }) => {
  return (
    <ul className="navbar-nav">
      <Dinamicos navItems={navItems} />
      <Estaticos />
    </ul>
  )
}

export default Menu

