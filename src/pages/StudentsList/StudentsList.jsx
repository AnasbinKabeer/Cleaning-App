import './Style.css';
import { useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';


const db = getFirestore(app);

function StList() {
  const navigate = useNavigate();
  const handleAddStudent = () => {
    navigate('/addStudent');
  };

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [level, setLevel] = useState('Level 1');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  // const [searchQuery, setSearchQuery] = useState('');

  const levels = useMemo(() => ['level1', 'level2', 'level3', 'level4', 'level5'], []);

  const fetchData = async (levelId) => {
    try {
      const docRef = doc(db, 'students', levelId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const studentsData = docSnap.data().students || [];
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        setHasChanges(false);
      } else {
        console.log('No such document!');
        setStudents([]);
        setFilteredStudents([]);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
      setStudents([]);
      setFilteredStudents([]);
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
      toast.success('Changes saved successfully!', { autoClose: 1000 });
    } catch (error) {
      console.error('Error updating document: ', error);
      setIsLoading(false);
      toast.error('Error saving changes.', { autoClose: 1000 });
    }
  };

  // const handleSearchChange = (event) => {
  //   const query = event.target.value.toLowerCase();
  //   setSearchQuery(query);
  //   setFilteredStudents(students.filter(student => student.name.toLowerCase().includes(query)));
  // };


  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <div className='st-container'>
      <ToastContainer position='top-center' />
      <div className="uppermain">
        <div className="st-left-uppermain">
          <span className='t-students'> Total Students: {totalStudents}</span>
          <span className='t-p-students'> Total Present: {totalPresent}</span>
        </div>
        <div className="right-uppermain">
          <Button variant="contained" color="success" onClick={handleAddStudent} sx={{ borderRadius: '10px' }} size="large">
            Add Student <IoIosAddCircleOutline className='add-icon' />
          </Button>
        </div>
      </div>

      <div className="data-div">

        <div className="table-link">
          {levels.map((levelId, idx) => (
            <div
              key={levelId}
              className={level === `Level ${idx + 1}` ? 't-link active' : 't-link'}
              onClick={() => { fetchData(levelId); setLevel(`Level ${idx + 1}`); }}
            >
              Level {idx + 1}
            </div>

          ))}

          {/* <div className='serh'>

            <input className='serchin' type="search" value={searchQuery}
              onChange={handleSearchChange} />


          </div> */}
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



                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td className='cl-t-no'>{index + 1}</td>
                    <td className='t-place'>{student.name}</td>
                    <td className={student.isPresent ? 't-status' : 't-status absent'}>
                      {student.isPresent ? "Present" : "Absent"}
                    </td>
                    <td className="t-edit">


                      <Checkbox {...label} size="small" checked={student.isPresent}
                        onChange={() => handleCheckboxChange(index)} />

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        </div>
      </div>
      <div className='cl-btns'>
        <button
          className={`save-btn btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSaveClick}
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default StList;
