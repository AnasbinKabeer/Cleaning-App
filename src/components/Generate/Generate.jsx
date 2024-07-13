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
    const level = selectedLevels[place];
    if (!level) {
      toast.error(`No level selected for ${place}`,{ autoClose: 2500 });
      setLoadingButton(null);
      return;
    }

    const studentsData = await fetchCollectionData("students", level);
    const cleaningPlacesData = await fetchCollectionData("cleaningPlace", place);

    if (studentsData && cleaningPlacesData) {
      let students = studentsData.students.filter(student => student.isPresent && !student.isPermanent);
      students = shuffleArray(students).slice(2);

      let assignedPlaces = [];
      let studentIndex = 0;

      cleaningPlacesData.cleaningPlace
        .filter(place => !place.isPermanent)
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
    setSubmitEnabled(true);
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
      <h2 className="newlist" >Generate New List</h2>
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
        disabled={!checkEnabled}
        className="button bgbtn"
      >
        Check
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
          "Submit"
        )}
      </button>
    </div>
  );
}

export default Generate;
