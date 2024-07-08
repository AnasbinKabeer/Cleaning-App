import { useState } from "react";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteField  } from "firebase/firestore";
import { app } from "../../firebase/config";

const db = getFirestore(app);

const cleaningPlaces = ["Masjid", "MNC Ground Floor", "MNC First Floor", "MNC Second Floor", "MNC Outside"];
const levels = ["level1", "level2", "level3", "level4", "level5"];

const Generate = () => {
  const [selectedLevels, setSelectedLevels] = useState({
    Masjid: "",
    "MNC Ground Floor": "",
    "MNC First Floor": "",
    "MNC Second Floor": "",
    "MNC Outside": "",
  });

  // Utility Functions
  const fetchCollectionData = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Event Handlers
  const handleGenerate = async (place) => {
    const level = selectedLevels[place];
    if (!level) {
      console.log(`No level selected for ${place}`);
      return;
    }

    const studentsData = await fetchCollectionData("students", level);
    const cleaningPlacesData = await fetchCollectionData("cleaningPlace", place);

    if (studentsData && cleaningPlacesData) {
      let students = studentsData.students.filter(student => student.isPresent && !student.isPermanent);
      students = shuffleArray(students).slice(5); // Shuffle and take after the 5th student

      let assignedPlaces = [];
      let studentIndex = 0;

      cleaningPlacesData.cleaningPlace
        .filter(place => !place.isPermanet) // Filter out permanent places
        .forEach(place => {
          let assignedStudents = [];
          for (let i = 0; i < place.quot && studentIndex < students.length; i++) {
            assignedStudents.push(students[studentIndex]);
            studentIndex++;
          }
          assignedPlaces.push({
            ...place,
            assignedStudents
          });
        });

      // Save to local storage and log to console
      localStorage.setItem(`${place}List`, JSON.stringify(assignedPlaces));
      console.log(`${place} List:`, assignedPlaces);
    }
  };

  const handleLevelChange = (place, level) => {
    setSelectedLevels(prevLevels => ({
      ...prevLevels,
      [place]: level
    }));
  };

  const getAvailableLevels = (place) => {
    return levels.filter(level => !Object.values(selectedLevels).includes(level) || selectedLevels[place] === level);
  };

  const handleCheck = async () => {
    let remainingStudents = [];
    for (const level of ["level4", "level5"]) {
      const studentsData = await fetchCollectionData("students", level);
      if (studentsData) {
        remainingStudents = remainingStudents.concat(studentsData.students.filter(student => student.isPresent && !student.isPermanent));
      }
    }

    remainingStudents = shuffleArray(remainingStudents);

    const allUpdatedPlaces = cleaningPlaces.map(place => {
      const placeList = JSON.parse(localStorage.getItem(`${place}List`));
      let studentIndex = 0;
      placeList.forEach(p => {
        if (p.assignedStudents.length === 0) {
          let assignedStudents = [];
          for (let i = 0; i < p.quot && studentIndex < remainingStudents.length; i++) {
            assignedStudents.push(remainingStudents[studentIndex]);
            studentIndex++;
          }
          p.assignedStudents = assignedStudents;
        }
      });
      localStorage.setItem(`${place}List`, JSON.stringify(placeList));
      return { place, placeList };
    });

    console.log("All updated data:", allUpdatedPlaces);
  };

  const handleSubmit = async () => {
    const generatedData = {};
    const cleaningPlaces = ['Masjid', 'MNC Ground Floor', 'MNC First Floor', 'MNC Second Floor', 'MNC Outside'];
  
    // Fetch and prepare new data
    cleaningPlaces.forEach(place => {
      const placeList = JSON.parse(localStorage.getItem(`${place}List`));
      generatedData[place] = placeList;
    });
  
    try {
      const ref = collection(db, "generatedList");
      const querySnapshot = await getDocs(ref);
      
      // Loop through each document and delete all fields
      for (const docSnapshot of querySnapshot.docs) {
        const docRef = doc(db, "generatedList", docSnapshot.id);
        const docData = docSnapshot.data();
        const updatedData = {};
  
        // Mark all fields for deletion
        for (const field in docData) {
          updatedData[field] = deleteField();
        }
  
        await updateDoc(docRef, updatedData);
      }
  
      // Submit new data
      for (const [place, data] of Object.entries(generatedData)) {
        await setDoc(doc(db, "generatedList", `${place}`), { data });
      }
  
      console.log("Data submitted successfully:", generatedData);
  
      // Clear local storage after successful submission
      cleaningPlaces.forEach(place => {
        localStorage.removeItem(`${place}List`);
      });
  
      console.log("Local storage cleared successfully");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  // Render Logic
  return (
    <div className="form">
      {cleaningPlaces.map((place, index) => (
        <div key={index}>
          <label htmlFor={place}>{place}</label>
          <select
            name={place.toLowerCase().replace(/ /g, "_")}
            onChange={(e) => handleLevelChange(place, e.target.value)}
            value={selectedLevels[place]}
          >
            <option value="" disabled>Select Level</option>
            {getAvailableLevels(place).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <button onClick={() => handleGenerate(place)}>Generate {place} List</button>
        </div>
      ))}
      <button onClick={handleCheck}>Check</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Generate;
