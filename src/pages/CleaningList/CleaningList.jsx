import { useState, useRef, useEffect } from 'react';
import './style.css';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import Nd from '../../assets/ND-Header.png';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Assuming the path is correct
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';

const db = getFirestore(app);

function CleaningList() {
  const navigate = useNavigate();
  const tableRef = useRef(); // Ref for table or data container

  const handleGenerate = () => {
    navigate('/generate-new'); // Example navigation function
  };

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [permanentData, setPermanentData] = useState([]);
  const [filteredPermanentData, setFilteredPermanentData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Masjid'); // Default selected location
  const [isEditing, setIsEditing] = useState(null); // Track editing row for generated data
  const [editedName, setEditedName] = useState(''); // Track edited name for generated data
  const [isEditingPermanent, setIsEditingPermanent] = useState(null); // Track editing row for permanent data
  const [editedNamePermanent, setEditedNamePermanent] = useState(''); // Track edited name for permanent data
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch data from generatedList collection
  const fetchGeneratedData = async () => {
    setLoading(true);
    try {
      const ref = collection(db, 'generatedList'); // Reference the collection
      const querySnapshot = await getDocs(ref); // Get documents snapshot
      const fetchedData = [];
      querySnapshot.forEach(doc => {
        const location = doc.id; // Get location name from document ID
        const locationData = doc.data().data || []; // Handle empty array

        locationData.forEach(item => {
          const place = item.place;
          const assignedStudents = item.assignedStudents || []; // Handle empty array
          const studentNames = assignedStudents.map(student => student.name).join(', '); // Extract and join student names

          fetchedData.push({ location, place, studentNames, docId: doc.id, itemId: item.place }); // Include document and item ID for updates
        });
      });
      setData(fetchedData);
      setFilteredData(fetchedData.filter(item => item.location === 'Masjid')); // Apply default filter
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Function to fetch data from permanentList collection
  const fetchPermanentData = async () => {
    setLoading(true);
    try {
      const ref = collection(db, 'permanentList'); // Reference the permanentList collection
      const querySnapshot = await getDocs(ref); // Get documents snapshot
      const fetchedPermanentData = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const cleaningArea = data.cleaningArea;
        const cleaningCategory = data.cleaningCategory;
        const students = data.students;

        fetchedPermanentData.push({ cleaningArea, cleaningCategory, students, docId: doc.id }); // Include document ID for updates
      });
      setPermanentData(fetchedPermanentData);
      setFilteredPermanentData(fetchedPermanentData.filter(item => item.cleaningCategory === 'Masjid')); // Apply default filter
    } catch (error) {
      console.error('Error fetching permanent list data:', error);
    }
    setLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchGeneratedData();
    fetchPermanentData();
  }, []);

  const handleFilterClick = (location) => {
    setSelectedLocation(location);
    if (location) {
      // Filter data based on selected location
      const filtered = data.filter(item => item.location === location);
      setFilteredData(filtered);

      const filteredPermanent = permanentData.filter(item => item.cleaningCategory === location);
      setFilteredPermanentData(filteredPermanent);
    } else {
      // Reset filter if no location is selected
      setFilteredData(data);
      setFilteredPermanentData(permanentData);
    }
  };

  const handleEditClick = (index, studentNames) => {
    setIsEditing(index);
    setEditedName(studentNames);
  };

  const handleSaveClick = async (index, docId, itemId) => {
    const newData = [...data];
    newData[index].studentNames = editedName;
    setData(newData);
    setIsEditing(null);

    // Update Firestore document
    try {
      const docRef = doc(db, 'generatedList', docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        const updatedData = docData.data.map(item => {
          if (item.place === itemId) {
            item.assignedStudents = editedName.split(', ').map(name => ({ name }));
          }
          return item;
        });
        await updateDoc(docRef, { data: updatedData });
        await fetchGeneratedData(); // Re-fetch data after update
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleEditClickPermanent = (index, students) => {
    setIsEditingPermanent(index);
    setEditedNamePermanent(students.join(', '));
  };

  const handleSaveClickPermanent = async (index, docId) => {
    const newData = [...permanentData];
    newData[index].students = editedNamePermanent.split(', ');
    setPermanentData(newData);
    setIsEditingPermanent(null);

    // Update Firestore document
    try {
      const docRef = doc(db, 'permanentList', docId);
      await updateDoc(docRef, { students: newData[index].students });
      await fetchPermanentData(); // Re-fetch data after update
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  let lastIndex = 0;
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <div className='cl-container'>
      <div className="uppermain">
        <div className="left-uppermain">
          <div className="st-left-uppermain">
            <span className='t-'>Date: 14/07/2024</span>
            <span className='t-p-students'>Sunday</span>
          </div>
        </div>
        <div className="right-uppermain">
          <Button variant="contained" color="success" onClick={handleGenerate} sx={{ borderRadius: '10px'}} size="large"> Generate New <IoIosAddCircleOutline className='add-icon' /></Button>
        </div>
      </div>

      <div className="data-div">
        <div className="table-link">
          <div className={selectedLocation === 'Masjid' ? 't-link active' : "t-link"} onClick={() => handleFilterClick('Masjid')}>Masjid</div>
          <div className={selectedLocation === 'MNC First Floor' ? 't-link active' : "t-link"} onClick={() => handleFilterClick('MNC First Floor')}>MNC First Floor</div>
          <div className={selectedLocation === 'MNC Second Floor' ? 't-link active' : "t-link"} onClick={() => handleFilterClick('MNC Second Floor')}>MNC Second Floor</div>
          <div className={selectedLocation === 'MNC Ground Floor' ? 't-link active' : "t-link"} onClick={() => handleFilterClick('MNC Ground Floor')}>MNC Ground Floor</div>
          <div className={selectedLocation === 'MNC Outside' ? 't-link active' : "t-link"} onClick={() => handleFilterClick('MNC Outside')}>MNC Outside</div>
        </div>

        <div className="table-data" ref={tableRef}>
          {/* Show loading spinner while data is being fetched */}
          {loading ? (
            <div className="loading-spinner">
              <CircularProgress />loading...
            </div>
          ) : (
            <>
              <div className="nd-header"><img src={Nd} width={"100%"} alt="" /></div>

              <center className='tablee'>
                <h1 className='category'>{selectedLocation} </h1>
                <table>
                  <thead>
                    <tr>
                      <th className='cl-t-main-no'>No</th>
                      <th className='t-main-place'>Cleaning Place</th>
                      <th className='t-main-place '>Name</th>
                      <th className='cl-t-action'>Edit</th>
                      <th className='cl-t-action'>Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => {
                      lastIndex = index + 1; // Update lastIndex here
                      return (
                        <tr key={index}>
                          <td className='cl-t-no'>{lastIndex + ")"}</td>
                          <td className='cl-t-place'>{item.place}</td>
                          <td className='colun'>:</td>
                          <td className='cl-t-name'>
                            {isEditing === index ? (
                              <TextField
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                size="small"
                              />
                            ) : (
                              item.studentNames
                            )}
                          </td>
                          <td className='cl-t-edit'>
                            {isEditing === index ? (
                              <IconButton
                                color="primary"
                                onClick={() => handleSaveClick(index, item.docId, item.itemId)}
                              >
                                <SaveIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                color="default"
                                onClick={() => handleEditClick(index, item.studentNames)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          </td>
                          <td className='cl-t-edit'>
                            <Checkbox {...label} size="small" />
                          </td>
                        </tr>
                      );
                    })}

                    {filteredPermanentData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className='cl-t-no'>{lastIndex +index+1+ ")"}</td>
                          <td className='cl-t-place'>{item.cleaningArea}</td>
                          <td className='colun'>:</td>
                          <td className='cl-t-name'>
                            {isEditingPermanent === index ? (
                              <TextField
                                value={editedNamePermanent}
                                onChange={(e) => setEditedNamePermanent(e.target.value)}
                                size="small"
                              />
                            ) : (
                              item.students.join(", ")
                            )}
                          </td>
                          <td className='cl-t-edit'>
                            {isEditingPermanent === index ? (
                              <IconButton
                                color="primary"
                                onClick={() => handleSaveClickPermanent(index, item.docId)}
                              >
                                <SaveIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                color="default"
                                onClick={() => handleEditClickPermanent(index, item.students)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          </td>
                          <td className='cl-t-edit'>
                            <Checkbox {...label} size="small" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </center>
            </>
          )}
        </div>
      </div>

      <div className='cl-btns'>
        <Button variant="contained" color="primary">
          Submit
        </Button>
        <ReactToPrint
          trigger={() => (
            <Button variant="contained" color="error">
              Print
            </Button>
          )}
          content={() => tableRef.current}
        />
      </div>
    </div>
  );
}

export default CleaningList;
