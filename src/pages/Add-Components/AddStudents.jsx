import { useNavigate } from 'react-router-dom';
import './style.css'
import { IoArrowBackCircle } from "react-icons/io5";
import StudentForm from '../../components/StudentForm/StudentForm';



function AddStudent() {

  const navigate = useNavigate();
  const handleback = () => {
    navigate('/list'); 
  };


  return (
    <div className="cl-container">
        <div className="addPage-top">
            <div ><IoArrowBackCircle onClick={handleback} className="addPage-top-back"/></div>
            <div className="addPage">       </div>

           
        </div>
        <StudentForm/>

    </div>

  )
}

export default AddStudent
