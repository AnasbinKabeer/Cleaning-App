import './style.css';
import { useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { getFirestore, getDocs, collection, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase/config';
import { useEffect, useState } from 'react';

const db = getFirestore(app);

function PermanentList() {
  const [data, setData] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate('/add-permanent');
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'permanentList'));
      const tempData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(tempData);
    };

    fetchData();
  }, []);

  const handleDelete = async (id, studentLevel, studentName, placeCategory, area) => {
    try {
      setDeletingId(id);

      // Fetch the specific student document
      const studentDocRef = doc(db, 'students', studentLevel);
      const studentDocSnapshot = await getDoc(studentDocRef);
      const studentData = studentDocSnapshot.data();

      if (studentData) {
        // Find the student in the array
        const studentIndex = studentData.students.findIndex(stud => stud.name === studentName);

        if (studentIndex !== -1) {
          // Update the student's isPermanent field to false
          const updatedStudents = [...studentData.students];
          updatedStudents[studentIndex].isPermanent = false;

          // Update the student document with the modified array
          await updateDoc(studentDocRef, {
            students: updatedStudents
          });
        }
      }

      // Fetch the specific place document
      const placeDocRef = doc(db, 'cleaningPlace', placeCategory);
      const placeDocSnapshot = await getDoc(placeDocRef);
      const placeData = placeDocSnapshot.data();

      if (placeData) {
        // Find the place in the array
        const placeIndex = placeData.cleaningPlace.findIndex(ar => ar.place === area);

        if (placeIndex !== -1) {
          // Update the place's isPermanent field to false
          const updatedPlace = [...placeData.cleaningPlace];
          updatedPlace[placeIndex].isPermanent = false;

          // Update the place document with the modified array
          await updateDoc(placeDocRef, {
            cleaningPlace: updatedPlace
          });
        }
      }

      // Delete the document from the permanentList collection
      await deleteDoc(doc(db, 'permanentList', id));

      // Update the local state to remove the deleted item
      setData(data.filter(item => item.id !== id));
      // toast.success('Successfully deleted from Permanent List', { autoClose: 3000 });
    } catch (error) {
      console.error('Error deleting item: ', error);
      toast.error('Error deleting item', { autoClose: 3000 });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='st-container'>
      <ToastContainer />
      <div className="uppermain">
        <div className="st-left-uppermain">
          <span className='t-students'> Total Students: </span>  
          <span className='t-p-students'> Total Present:</span>
        </div>
        <div className="right-uppermain">
          <button className="Btn-add" onClick={handleAdd}>Add Permanent List<IoIosAddCircleOutline className='add-icon' /></button>
        </div>
      </div>

      <div className="data-div">
        <div className="table-data">
          <center>
            <table>
              <thead>
                <tr>
                  <th className='pl-t-main-no'>No</th>
                  <th className='t-main-place'>Cleaning Category</th>
                  <th className='t-main-place'>Cleaning Area</th>
                  <th className="t-main-place">Cleaner</th>
                  <th className="t-main-special">Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td className='pl-t-no'>{index + 1}</td>
                    <td className='t-place'>{item.cleaningCategory}</td>
                    <td className='t-place'>{item.cleaningArea}</td>
                    <td className="t-place">{item.student}</td>
                    <td className="t-special">
                      <button 
                        onClick={() => handleDelete(item.id, item.studentLevel, item.student, item.cleaningCategory, item.cleaningArea)} 
                        className={`delete ${deletingId === item.id ? 'deleting' : ''}`}>
                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        </div>
        <div className='st-t-btns'>
          <button className="save-btn btn">Save</button>
        </div>
      </div>
    </div>
  );
}

export default PermanentList;
