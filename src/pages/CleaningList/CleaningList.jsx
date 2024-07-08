import { useState, useRef, useEffect } from 'react';
import './style.css';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import Nd from '../../assets/ND-Header.png';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Assuming the path is correct

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

  // Fetch data from generatedList collection
  useEffect(() => {
    const getData = async () => {
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

            fetchedData.push({ location, place, studentNames });
          });
        });
        setData(fetchedData);
        setFilteredData(fetchedData.filter(item => item.location === 'Masjid')); // Apply default filter
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  // Fetch data from permanentList collection
  useEffect(() => {
    const getPermanentData = async () => {
      try {
        const ref = collection(db, 'permanentList'); // Reference the permanentList collection
        const querySnapshot = await getDocs(ref); // Get documents snapshot
        const fetchedPermanentData = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const cleaningArea = data.cleaningArea;
          const cleaningCategory = data.cleaningCategory;
          const student = data.student;

          fetchedPermanentData.push({ cleaningArea, cleaningCategory, student });
        });
        setPermanentData(fetchedPermanentData);
        setFilteredPermanentData(fetchedPermanentData.filter(item => item.cleaningCategory === 'Masjid')); // Apply default filter
      } catch (error) {
        console.error('Error fetching permanent list data:', error);
      }
    };

    getPermanentData();
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

  let lastIndex = 0;

  return (
    <div className='cl-container'>
      <div className="uppermain">
        <div className="left-uppermain"><h2>Total:</h2></div>
        <div className="right-uppermain">
          <button className="Btn-add" onClick={handleGenerate}>Generate New<IoIosAddCircleOutline className='add-icon' /></button>
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
          {/* Table data */}
          <div className="nd-header"><img src={Nd} width={"100%"} alt="" /></div>

          <center className='tablee'>
            <h1 className='category'>{selectedLocation}</h1>
            <table>
              <thead>
                <tr>
                  <th className='cl-t-main-no'>No</th>
                  <th className='t-main-place'>Cleaning Place</th>
                  <th className='t-main-name'>Name</th>
                  <th className='t-main-edit'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  lastIndex = index + 1; // Update the variable with the current index
                  return (
                    <tr key={index}>
                      <td className='cl-t-no'>{index + 1 + ")"}</td>
                      <td className='cl-t-place'>{item.place}</td>
                      <td className='colun'>:</td>
                      <td className='cl-t-name'>{item.studentNames}</td>
                      <td className='cl-t-edit'>
                        <input type="checkbox" defaultChecked={item.status} />
                      </td>
                    </tr>
                  );
                })}

                {filteredPermanentData.map((item, index) => (
                  <tr key={index + lastIndex}>
                    <td className='cl-t-no'>{lastIndex + index + 1 + ")"}</td>
                    <td className='cl-t-place'>{item.cleaningArea}</td>
                    <td className='colun'>:</td>
                    <td className='cl-t-name'>{item.student}</td>
                    <td className='cl-t-edit'>
                      <input type="checkbox" defaultChecked={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        </div>

        <div className='t-btns'>
          <ReactToPrint
            trigger={() => (
              <button className="print-btn btn">Print</button>
            )}
            content={() => tableRef.current}
          />
          {/* Submit button or other buttons */}
          {/* <button className='submit-btn btn'>Submit</button> */}
        </div>
      </div>
    </div>
  );
}

export default CleaningList;
