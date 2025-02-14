import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteField } from "firebase/firestore";
import { app } from "../../firebase/config";
import './style.css';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [generateClicked, setGenerateClicked] = useState({
    Masjid: false,
    "MNC Ground Floor": false,
    "MNC First Floor": false,
    "MNC Second Floor": false,
    "MNC Outside": false,
  });
  const [checkEnabled, setCheckEnabled] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const allGenerated = Object.values(generateClicked).every(val => val);
    setCheckEnabled(allGenerated);
  }, [generateClicked]);

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

  const handleGenerate = async (place) => {
    setLoadingButton(place);
    const level = selectedLevels[place]; // Assumed you have selectedLevels state
    if (!level) {
      toast.error(`No level selected for ${place}`, { autoClose: 2500 });
      setLoadingButton(null);
      return;
    }

    const studentsData = await fetchCollectionData("students", level);
    const cleaningPlacesData = await fetchCollectionData("cleaningPlace", place);

    if (studentsData && cleaningPlacesData) {
      let students = studentsData.students.filter(student => student.isPresent && !student.isPermanent);
      students = shuffleArray(students);

      let level4general = [];
      let tobeassignedsudentsoflevel4 = [];
      let tobeassignedsudentsoflevel5 = [];

      if (level === "level4") {
        level4general = students.slice(0, 25);
        tobeassignedsudentsoflevel4 = students.slice(25);
        localStorage.setItem('tobeassignedsudentsoflevel4', JSON.stringify(tobeassignedsudentsoflevel4));
        console.log('level4general',level4general)
        console.log('tobeassignedsudentsoflevel4',tobeassignedsudentsoflevel4)
      } else if (level === "level5") {
        level4general = students.slice(0, 25);
        tobeassignedsudentsoflevel5 = students.slice(25);
        localStorage.setItem('tobeassignedsudentsoflevel5', JSON.stringify(tobeassignedsudentsoflevel5));
      } else {
        level4general = students.slice(2);
      }

      let assignedPlaces = [];
      let studentIndex = 0;

      cleaningPlacesData.cleaningPlace
        .filter(place => !place.isPermanet)
        .forEach(place => {
          let assignedStudents = [];
          for (let i = 0; i < place.quot && studentIndex < level4general.length; i++) {
            assignedStudents.push(level4general[studentIndex]);
            studentIndex++;
          }
          assignedPlaces.push({
            ...place,
            assignedStudents
          });
        });

      localStorage.setItem(`${place}List`, JSON.stringify(assignedPlaces));
      console.log(`${place} List:`, assignedPlaces);
      setGenerateClicked(prevState => ({ ...prevState, [place]: true }));
    }
    setLoadingButton(null);
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
    setChecking(true);
  
    // Retrieve the students to be assigned from localStorage
    let tobeassignedsudentsoflevel4 = JSON.parse(localStorage.getItem('tobeassignedsudentsoflevel4')) || [];
    let tobeassignedsudentsoflevel5 = JSON.parse(localStorage.getItem('tobeassignedsudentsoflevel5')) || [];
    let remainingStudents = tobeassignedsudentsoflevel4.concat(tobeassignedsudentsoflevel5);
  
    // Assign remaining students to empty places
    const allUpdatedPlaces = cleaningPlaces.map(place => {
      const placeList = JSON.parse(localStorage.getItem(`${place}List`));
      let studentIndex = 0;
      placeList.forEach(p => {
        if (p.assignedStudents.length === 0 && studentIndex < remainingStudents.length) {
          let assignedStudents = [];
          for (let i = 0; i < p.quot && studentIndex < remainingStudents.length; i++) {
            assignedStudents.push(remainingStudents[studentIndex]);
            studentIndex++;
          }
          p.assignedStudents = assignedStudents;
        }
      });
  
      // Remove the assigned students from remainingStudents
      remainingStudents = remainingStudents.slice(studentIndex);
  
      localStorage.setItem(`${place}List`, JSON.stringify(placeList));
      return { place, placeList };
    });
  
    console.log("All updated data:", allUpdatedPlaces);
    setSubmitEnabled(true);
    setChecking(false);
  };
  
  
  const handleSubmit = async () => {
    setSubmitLoading(true);
    const generatedData = {};
    const cleaningPlaces = ['Masjid', 'MNC Ground Floor', 'MNC First Floor', 'MNC Second Floor', 'MNC Outside'];

    cleaningPlaces.forEach(place => {
      const placeList = JSON.parse(localStorage.getItem(`${place}List`));
      generatedData[place] = placeList;
    });

    try {
      const ref = collection(db, "generatedList");
      const querySnapshot = await getDocs(ref);

      for (const docSnapshot of querySnapshot.docs) {
        const docRef = doc(db, "generatedList", docSnapshot.id);
        const docData = docSnapshot.data();
        const updatedData = {};

        for (const field in docData) {
          updatedData[field] = deleteField();
        }

        await updateDoc(docRef, updatedData);
      }

      for (const [place, data] of Object.entries(generatedData)) {
        await setDoc(doc(db, "generatedList", `${place}`), { data });
      }

      console.log("Data submitted successfully:", generatedData);

      cleaningPlaces.forEach(place => {
        localStorage.removeItem(`${place}List`);
      });

      console.log("Local storage cleared successfully");
      navigate('/cleaning')
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const navigate = useNavigate();
  
  return (
    <div className="form">
      <ToastContainer position='top-center' />
      <h2 className="newlist">Generate New List</h2>
      {cleaningPlaces.map((place, index) => (
        <div key={index} className="form-group">
          <label htmlFor={place} className="label">{place}:</label>
          <select
            name={place.toLowerCase().replace(/ /g, "_")}
            onChange={(e) => handleLevelChange(place, e.target.value)}
            value={selectedLevels[place]}
            className="select"
          >
            <option value="" disabled>Select Level</option>
            {getAvailableLevels(place).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <button 
            onClick={() => handleGenerate(place)} 
            disabled={generateClicked[place]}
            className={`button ${loadingButton === place ? "rotating" : ""}`}
          >
            {loadingButton === place ? (
              <div className="spinner"></div>
            ) : (
              `GenerateList`
            )}
          </button>
        </div>
      ))}
      <button 
        onClick={handleCheck} 
        disabled={!checkEnabled || checking}
        className={`button bgbtn ${checking ? "loading" : ""}`}
      >
        {checking ? (
          <>
            <div className="spinner"></div>
            Checking...
          </>
        ) : (
          `Check`
        )}
      </button>
      <button 
        onClick={handleSubmit} 
        disabled={!submitEnabled || submitLoading}
        className={`button bgbtn ${submitLoading ? "loading" : ""}`}
      >
        {submitLoading ? (
          <>
            <div className="spinner"></div>
            Submitting...
          </>
        ) : (
          `Submit`
        )}
      </button>
    </div>
  );
};

export default Generate;
