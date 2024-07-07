import './Style.css';
import { useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const db = getFirestore(app);

function StList() {
  const navigate = useNavigate();
  const handleAddStudent = () => {
    navigate('/addStudent');
  };

  const [students, setStudents] = useState([]);
  const [level, setLevel] = useState('Level 1');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);

  const levels = useMemo(() => ['level1', 'level2', 'level3', 'level4', 'level5'], []);

  const fetchData = async (levelId) => {
    try {
      const docRef = doc(db, 'students', levelId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudents(docSnap.data().students || []);
        setHasChanges(false);
      } else {
        console.log('No such document!');
        setStudents([]);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
      setStudents([]);
      setHasChanges(false);
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      let total = 0;
      let present = 0;
      for (let levelId of levels) {
        const docRef = doc(db, 'students', levelId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const levelStudents = docSnap.data().students || [];
          total += levelStudents.length;
          present += levelStudents.filter(student => student.isPresent).length;
        }
      }
      setTotalStudents(total);
      setTotalPresent(present);
    } catch (error) {
      console.error('Error fetching all documents: ', error);
    }
  }, [levels]);

  useEffect(() => {
    fetchData('level1');
    fetchAllData();
  }, [fetchAllData]);

  const handleCheckboxChange = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].isPresent = !updatedStudents[index].isPresent;
    setStudents(updatedStudents);
    setHasChanges(true);
  };

  const handleSaveClick = async () => {
    try {
      setIsLoading(true);
      const docRef = doc(db, 'students', level.toLowerCase().replace(' ', ''));
      await updateDoc(docRef, { students });
      setHasChanges(false);
      setIsLoading(false);
      fetchAllData(); // Refresh total counts after saving
      toast.success('Changes saved successfully!', { autoClose: 3000 });
    } catch (error) {
      console.error('Error updating document: ', error);
      setIsLoading(false);
      toast.error('Error saving changes.', { autoClose: 3000 });
    }
  };

  return (
    <div className='st-container'>
      <ToastContainer position='top-center'/>
      <div className="uppermain">
        <div className="st-left-uppermain">
          <span className='t-students'> Total Students: {totalStudents}</span>  
          <span className='t-p-students'> Total Present: {totalPresent}</span>
        </div>
        <div className="right-uppermain">
          <button className="Btn-add" onClick={handleAddStudent}>Add Student<IoIosAddCircleOutline className='add-icon' /></button>
        </div>
      </div>

      <div className="data-div">
        <div className="table-link">
          <div className={level === 'Level 1' ? 't-link active' : "t-link"} onClick={() => { fetchData('level1'); setLevel('Level 1'); }}>Level 01</div>
          <div className={level === 'Level 2' ? 't-link active' : "t-link"} onClick={() => { fetchData('level2'); setLevel('Level 2'); }}>Level 02</div>
          <div className={level === 'Level 3' ? 't-link active' : "t-link"} onClick={() => { fetchData('level3'); setLevel('Level 3'); }}>Level 03</div>
          <div className={level === 'Level 4' ? 't-link active' : "t-link"} onClick={() => { fetchData('level4'); setLevel('Level 4'); }}>Level 04</div>
          <div className={level === 'Level 5' ? 't-link active' : "t-link"} onClick={() => { fetchData('level5'); setLevel('Level 5'); }}>Level 05</div>
        </div>
        <div className="table-data">
          <center>
            <table>
              <thead>
                <tr>
                  <th className='cl-t-main-no'>No</th>
                  <th className='t-main-place'>Name</th>
                  <th className='t-main-name'>Status</th>
                  <th className="t-main-edit">Edit</th>
                  {/* <th>Total: {students.length}</th> */}
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td className='cl-t-no'>{index + 1}</td>
                    <td className='t-place'>{student.name}</td>
                    <td className={student.isPresent ? 't-status' : 't-status absent'}>{student.isPresent ? "Present" : "Absent"}</td>
                    <td className="t-edit">
                      <input
                        type="checkbox"
                        checked={student.isPresent}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        </div>
        <div className='st-t-btns'>
          <button
            className={`save-btn btn ${isLoading ? 'loading' : ''}`}
            onClick={handleSaveClick}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StList;
