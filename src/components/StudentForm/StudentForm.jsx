import './style.css'
import { useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Adjust the import path if necessary

const db = getFirestore(app);

const StudentForm = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('level1');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = {
      name,
      isPermanent: false,
      isPresent: true
    };

    try {
      const docRef = doc(db, 'students', level);
      await updateDoc(docRef, {
        students: arrayUnion(student)
      });
      alert('Student added successfully');
      setName('');
    } catch (error) {
      console.error('Error adding student: ', error);
      alert('Failed to add student');
    }
  };

  return (
    
    <form className="form-container" onSubmit={handleSubmit}>
       <h2> Add Student</h2>
    <div className="form-group">
     
      <label className="form-label">Student Name:</label>
      <input 
        type="text" 
        className="form-input" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
    </div>
    <div className="form-group">
      <label className="form-label">Class:</label>
      <select 
        className="form-select" 
        value={level} 
        onChange={(e) => setLevel(e.target.value)}
        required
      >
        <option value="level1">Level 1</option>
        <option value="level2">Level 2</option>
        <option value="level3">Level 3</option>
        <option value="level4">Level 4</option>
        <option value="level5">Level 5</option>
      </select>
    </div>
    <button className="form-button" type="submit">Submit</button>
  </form>
  
  );
};

export default StudentForm;
