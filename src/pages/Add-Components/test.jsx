import { useState } from 'react';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { app } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const db = getFirestore(app);

const CleaningManagement = () => {
  const navigate = useNavigate();
  const [cleaningData, setCleaningData] = useState(null);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const fetchAndProcessData = async () => {
    try {
      // Fetch students data
      const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
      const studentPromises = levels.map(level => getDoc(doc(db, 'students', level)));
      const studentDocs = await Promise.all(studentPromises);

      const filteredLevels = studentDocs.map((docSnapshot, index) => {
        const students = docSnapshot.data().students;
        return students.filter(student => student.isPresent && !student.isPermanent).map(student => student.name);
      });

      const shuffledLevels = filteredLevels.map(level => shuffleArray(level));
      const specialLevels = shuffledLevels.map(level => level.slice(0, 5));
      const generalLevels = shuffledLevels.map(level => level.slice(5));

      // Combine all general levels into one pool
      const combinedGeneralLevels = [].concat(...generalLevels);
      shuffleArray(combinedGeneralLevels);  // Shuffle the combined pool

      // Fetch cleaningPlace data
      const places = ['Masjid', 'MNC Ground Floor', 'MNC First Floor', 'MNC Second Floor', 'MNC Outside'];
      const placePromises = places.map(place => getDoc(doc(db, 'cleaningPlace', place)));
      const placeDocs = await Promise.all(placePromises);

      const generalPlaces = placeDocs.map(docSnapshot => {
        const cleaningPlaces = docSnapshot.data().cleaningPlace;
        return cleaningPlaces.filter(place => !place.isPermanet && !place.isSpeacialPlace).map(place => ({ place: place.place, quot: place.quot }));
      });

      const specialPlaces = placeDocs.map(docSnapshot => {
        const cleaningPlaces = docSnapshot.data().cleaningPlace;
        return cleaningPlaces.filter(place => !place.isPermanet && place.isSpeacialPlace).map(place => place.place);
      });

      // Flatten final data to avoid nested arrays and add category
      const finalData = [];
      generalPlaces.forEach((placeList, index) => {
        const category = places[index];
        placeList.forEach((place) => {
          const studentNames = combinedGeneralLevels.splice(0, place.quot);
          finalData.push({
            place: place.place,
            students: studentNames,
            category: category
          });
        });
      });

      // Prepare the data to be sent to Firestore
      const dataToSave = {
        finalData,
        generatedDate: new Date().toISOString()
      };

      // Save the data to Firestore
      await addDoc(collection(db, 'cleaningList'), dataToSave);

      // Log intermediate and final data
      console.log(specialLevels)

      setCleaningData(dataToSave);

      setTimeout(() => {
        window.location.href = '/cleaning';
      }, 1000); // 5000 milliseconds = 5 seconds

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    
  };

  return (
    <div>
      <button onClick={fetchAndProcessData}>Generate List</button>
      {cleaningData && <pre>{JSON.stringify(cleaningData, null, 2)}</pre>}
    </div>
  );
};

export default CleaningManagement;
