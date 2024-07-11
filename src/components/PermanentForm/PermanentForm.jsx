import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase/config';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const db = getFirestore(app);

function PermanentForm() {
  const [cleaningCategories, setCleaningCategories] = useState([]);
  const [cleaningAreas, setCleaningAreas] = useState([]);
  const [selectedCleaningCategory, setSelectedCleaningCategory] = useState('');

  const [studentLevels, setStudentLevels] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentLevel, setSelectedStudentLevel] = useState('');

  const [selectedStudents, setSelectedStudents] = useState(['', '']);
  const [selectedCleaningArea, setSelectedCleaningArea] = useState('');

  useEffect(() => {
    const fetchCleaningCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'cleaningPlace'));
      const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCleaningCategories(categories);
    };

    const fetchStudentLevels = async () => {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const levels = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudentLevels(levels);
    };

    fetchCleaningCategories();
    fetchStudentLevels();
  }, []);

  const handleCleaningCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    setSelectedCleaningCategory(selectedCategory);

    if (selectedCategory) {
      const docRef = doc(db, 'cleaningPlace', selectedCategory);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCleaningAreas(docSnap.data().cleaningPlace || []);
      }
    } else {
      setCleaningAreas([]);
    }
  };

  const handleStudentLevelChange = async (event) => {
    const selectedLevel = event.target.value;
    setSelectedStudentLevel(selectedLevel);

    if (selectedLevel) {
      const docRef = doc(db, 'students', selectedLevel);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudents(docSnap.data().students || []);
      }
    } else {
      setStudents([]);
    }
  };

  const handleStudentChange = (index, event) => {
    const newSelectedStudents = [...selectedStudents];
    newSelectedStudents[index] = event.target.value;
    setSelectedStudents(newSelectedStudents);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedCleaningCategory && selectedCleaningArea && selectedStudentLevel && selectedStudents[0]) {
      const studentsToAssign = selectedStudents.filter(student => student);
      const assignment = {
        cleaningCategory: selectedCleaningCategory,
        cleaningArea: selectedCleaningArea,
        studentLevel: selectedStudentLevel,
        students: studentsToAssign
      };

      try {
        // Add assignment to permanentList collection
        const docRef = await addDoc(collection(db, 'permanentList'), assignment);
        toast.success('Successfully Added to Permanent List', { autoClose: 3000 });

        // Update isPermanent to true for selected students in students collection
        const studentDocRef = doc(db, 'students', selectedStudentLevel);
        const studentDocSnap = await getDoc(studentDocRef);
        if (studentDocSnap.exists()) {
          const studentData = studentDocSnap.data().students;
          const updatedStudents = studentData.map(student => {
            if (studentsToAssign.includes(student.name)) {
              return { ...student, isPermanent: true };
            }
            return student;
          });

          await updateDoc(studentDocRef, { students: updatedStudents });
        }

        // Update isPermanent to true for selected cleaning place in cleaningPlace collection
        const cleaningPlaceDocRef = doc(db, 'cleaningPlace', selectedCleaningCategory);
        const cleaningPlaceDocSnap = await getDoc(cleaningPlaceDocRef);

        if (cleaningPlaceDocSnap.exists()) {
          const cleaningPlaceData = cleaningPlaceDocSnap.data().cleaningPlace;
          const updatedCleaningPlaces = cleaningPlaceData.map(place => {
            if (place.place === selectedCleaningArea) {
              return { ...place, isPermanent: true };
            }
            return place;
          });

          await updateDoc(cleaningPlaceDocRef, { cleaningPlace: updatedCleaningPlaces });
        }

        // Optionally, you can reset the form fields here
        setSelectedCleaningCategory('');
        setSelectedCleaningArea('');
        setSelectedStudentLevel('');
        setSelectedStudents(['', '']);

      } catch (error) {
        console.error('Error adding assignment or updating isPermanent: ', error);
        toast.error('Error adding assignment or updating isPermanent.');
      }
    } else {
      console.error('Please fill out all required fields');
      toast.error('Please fill out all required fields.');
    }
  };

  return (
    <div>
      <ToastContainer position='top-center' />
      <form className="permanent-cleaner-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Add Permanent Cleaner</h2>

        <h3 className="section-title">Area</h3>
        <select className="cleaning-category" onChange={handleCleaningCategoryChange} value={selectedCleaningCategory}>
          <option value="">Select cleaning category</option>
          {cleaningCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.id}</option>
          ))}
        </select>

        <select className="cleaning-place" onChange={(e) => setSelectedCleaningArea(e.target.value)} value={selectedCleaningArea}>
          <option value="">Select cleaning area</option>
          {cleaningAreas.map((area, index) => (
            <option key={index} value={area.place}>{area.place}</option>
          ))}
        </select>

        <h3 className="section-title">Cleaner</h3>
        <select className="class-of-cleaner" onChange={handleStudentLevelChange} value={selectedStudentLevel}>
          <option value="">Select Level</option>
          {studentLevels.map((level) => (
            <option key={level.id} value={level.id}>{level.id}</option>
          ))}
        </select>

        <select className="student" onChange={(e) => handleStudentChange(0, e)} value={selectedStudents[0]}>
          <option value="">Select student 1</option>
          {students.map((student, index) => (
            <option key={index} value={student.name}>{student.name}</option>
          ))}
        </select>

        <select className="student" onChange={(e) => handleStudentChange(1, e)} value={selectedStudents[1]}>
          <option value="">Select student 2 (optional)</option>
          {students.map((student, index) => (
            <option key={index} value={student.name}>{student.name}</option>
          ))}
        </select>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default PermanentForm;
