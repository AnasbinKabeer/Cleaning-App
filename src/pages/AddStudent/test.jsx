import { useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Adjust the import path if necessary
import { shuffleArray } from './utils'; // Assuming you have a utility function to shuffle an array

const db = getFirestore(app);

const CleaningManagement = () => {
  const [specialLevels, setSpecialLevels] = useState({});
  const [generalLevels, setGeneralLevels] = useState({});
  const [specialPlaces, setSpecialPlaces] = useState({});
  const [generalPlaces, setGeneralPlaces] = useState({});

  const fetchAndProcessData = async () => {
    const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
    let filteredData = {};
    let specialPlaces = {};
    let generalPlaces = {};

    // Fetch and filter student data
    for (const level of levels) {
      const docRef = doc(db, 'students', level);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const students = docSnap.data().students;
        filteredData[level] = students.filter(student => student.isPresent && !student.isPermanent);
      } else {
        console.log(`No such document: ${level}`);
      }
    }

    // Shuffle student data
    let shuffledData = {};
    for (const level in filteredData) {
      shuffledData[level] = shuffleArray(filteredData[level]);
    }

    // Assign special and general student levels
    let specialLevels = {};
    let generalLevels = {};
    for (const level in shuffledData) {
      specialLevels[level] = shuffledData[level].slice(0, 5);
      generalLevels[level] = shuffledData[level].slice(5);
    }

    // Fetch and filter cleaning place data
    const places = ['Masjid', 'MNC Ground Floor', 'MNC First Floor', 'MNC Second Floor', 'MNC Outside'];
    for (const place of places) {
      const docRef = doc(db, 'cleaningPlace', place);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cleaningPlaces = docSnap.data().cleaningPlace;
        specialPlaces[place] = cleaningPlaces.filter(place => !place.isPermanet && place.isSpeacialPlace);
        generalPlaces[place] = cleaningPlaces.filter(place => !place.isPermanet && !place.isSpeacialPlace);
      } else {
        console.log(`No such document: ${place}`);
      }
    }

    // Update state
    setSpecialLevels(specialLevels);
    setGeneralLevels(generalLevels);
    setSpecialPlaces(specialPlaces);
    setGeneralPlaces(generalPlaces);

    // Log the results
    console.log('Special Levels:', specialLevels);
    console.log('General Levels:', generalLevels);
    console.log('Special Places:', specialPlaces);
    console.log('General Places:', generalPlaces);

    // Log the place values
    console.log('Special Places:');
    for (const place in specialPlaces) {
      specialPlaces[place].forEach(p => console.log(p.place));
    }
    console.log('General Places:');
    for (const place in generalPlaces) {
      generalPlaces[place].forEach(p => console.log(p.place));
    }

    // Log the name values
    console.log('Special Levels Names:');
    for (const level in specialLevels) {
      specialLevels[level].forEach(s => console.log(s.name));
    }
    console.log('General Levels Names:');
    for (const level in generalLevels) {
      generalLevels[level].forEach(s => console.log(s.name));
    }
  };

  return (
    <div>
      <button onClick={fetchAndProcessData}>Generate List</button>
      <pre>
        {JSON.stringify({ specialLevels, generalLevels, specialPlaces, generalPlaces }, null, 2)}
      </pre>
    </div>
  );
};

export default CleaningManagement;
