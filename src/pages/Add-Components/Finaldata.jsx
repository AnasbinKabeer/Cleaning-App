import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase/config';

const db = getFirestore(app);

const CleaningListPage = () => {
  const [cleaningData, setCleaningData] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('Masjid'); // Default filter

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cleaningList'));
      let data = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });
      setCleaningData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleButtonClick = (place) => {
    setSelectedPlace(place);
  };

  const renderTable = () => {
    if (cleaningData.length === 0) {
      return <p>No data available</p>;
    }

    const filteredData = cleaningData.flatMap(item => item.finalData).filter(item => item.placeCategory === selectedPlace);

    return (
      <table>
        <thead>
          <tr>
            <th>Place</th>
            <th>Students</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.place}</td>
              <td>{item.students.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div>
        <button onClick={() => handleButtonClick('Masjid')}>Masjid</button>
        <button onClick={() => handleButtonClick('MNC Ground Floor')}>MNC Ground Floor</button>
        <button onClick={() => handleButtonClick('MNC First Floor')}>MNC First Floor</button>
        <button onClick={() => handleButtonClick('MNC Second Floor')}>MNC Second Floor</button>
        <button onClick={() => handleButtonClick('MNC Outside')}>MNC Outside</button>
      </div>
      <div>
        {renderTable()}
      </div>
    </div>
  );
};

export default CleaningListPage;
