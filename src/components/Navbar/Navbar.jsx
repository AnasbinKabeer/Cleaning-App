import './style.css'
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { IoPerson } from "react-icons/io5";
import { useState } from 'react';
import { RiFindReplaceFill } from "react-icons/ri";


const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const handleClick = (path) => {
    setActive(path);
  };


  return (
    <div className="nav-bar">
      <div className="logo-bar">SOCIAL CLIQUE</div>
      <div className="links-bar">
        <Link to="/dashboard" onClick={() => handleClick('/dashboard')}>
          <div className={active === '/dashboard' ? 'link active' : 'link'}>
            <span><MdSpaceDashboard /></span> Dashboard
          </div>
        </Link>

        <Link to="/cleaning" onClick={() => handleClick('/cleaning')}>
          <div className={active === '/cleaning' ? 'link active' : 'link'}>
            <span><FaLayerGroup /></span> Cleaning List
          </div>
        </Link>

        <Link to="/list" onClick={() => handleClick('/list')}>
          <div className={active === '/list' ? 'link active' : 'link'}>
            <span><FaUserGroup /></span> Students List
          </div>
        </Link>

        <Link to="/permanent-list" onClick={() => handleClick('/permanent-list')}>
          <div className={active === '/permanent-list' ? 'link active' : 'link'}>
            <span><IoPerson /></span> Permanent List
          </div>
        </Link>
        <Link to="/area" onClick={() => handleClick('/area')}>
          <div className={active === '/area' ? 'link active' : 'link'}>
            <span><RiFindReplaceFill /></span>
            Cleaning area
          </div>
        </Link>

      </div>

    </div>
  )
}

export default Navbar
