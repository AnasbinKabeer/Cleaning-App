import { useNavigate } from 'react-router-dom';
import './style.css'
import { IoArrowBackCircle } from "react-icons/io5";

import AreaForm from '../../components/AreaForm/AreaForm';



function AddArea() {

  const navigate = useNavigate();
  const handleback = () => {
    navigate('/area'); 
  };


  return (
    <div className="cl-container">
        <div className="addPage-top">
            <div ><IoArrowBackCircle onClick={handleback} className="addPage-top-back"/></div>
            <div className="addPage">       </div>

           
        </div>
        <AreaForm/>

    </div>

  )
}

export default  AddArea
