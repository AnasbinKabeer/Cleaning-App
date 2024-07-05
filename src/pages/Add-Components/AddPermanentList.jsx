import { useNavigate } from 'react-router-dom';
import './style.css'
import { IoArrowBackCircle } from "react-icons/io5";
import PermanentForm from '../../components/PermanentForm/PermanentForm';



function AddPermanentList() {

  const navigate = useNavigate();
  const handleback = () => {
    navigate('/permanent-list'); 
  };


  return (
    <div className="cl-container">
        <div className="addPage-top">
            <div ><IoArrowBackCircle onClick={handleback} className="addPage-top-back"/></div>
            <div className="addPage">       </div>

           
        </div>
        <PermanentForm/>
    </div>

  )
}

export default AddPermanentList;
