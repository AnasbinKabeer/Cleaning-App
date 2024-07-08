import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Assuming the path is correct

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Masjid'); // Default selected location

  useEffect(() => {
    const getData = async () => {
      try {
        const db = getFirestore(app); // Get Firestore instance
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

  const handleFilterClick = (location) => {
    setSelectedLocation(location);
    if (location) {
      // Filter data based on selected location
      const filtered = data.filter(item => item.location === location);
      setFilteredData(filtered);
    } else {
      // Reset filter if no location is selected
      setFilteredData(data);
    }
  };

  return (
    <div>
      {/* Filter buttons */}
      <button onClick={() => handleFilterClick('Masjid')}>Masjid</button>
      <button onClick={() => handleFilterClick('MNC First Floor')}>MNC First Floor</button>
      <button onClick={() => handleFilterClick('MNC Second Floor')}>MNC Second Floor</button>
      <button onClick={() => handleFilterClick('MNC Ground Floor')}>MNC Ground Floor</button>
      <button onClick={() => handleFilterClick('MNC Outside')}>MNC Outside</button>

      <table>
        <thead>
          <tr>
            <th>Place</th>
            <th>Assigned Students</th>
          </tr>
        </thead>
        <tbody>
          {selectedLocation ? filteredData.map((item, index) => (  // Display filtered data
            <tr key={index}>
 <td className='cl-t-no'>{index + 1 + ")"}</td>
 <td className='cl-t-place'>{item.place}</td>
 <td className='cl-t-name'>{item.studentNames}</td>
            </tr>
          )) : data.map((item, index) => (  // Display all data if no filter applied
            <tr key={index}>
        
              <td>{item.place}</td>
              <td>{item.studentNames}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;


