import { useNavigate } from 'react-router-dom';
import './style.css'
import { IoArrowBackCircle } from "react-icons/io5";
import Generate from '../../components/Generate/Generate';



function GenerateNew() {

  const navigate = useNavigate();
  const handleback = () => {
    navigate('/cleaning'); 
  };


  return (
    <div className="cl-container">
        <div className="addPage-top">
            <div ><IoArrowBackCircle onClick={handleback} className="addPage-top-back"/></div>
            <div className="addPage">       </div>

           
        </div>
        <Generate/>

    </div>

  )
}

export default GenerateNew
