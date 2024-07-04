import './style.css'
import { useState } from 'react';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Adjust the import path if necessary

const db = getFirestore(app);

const AreaForm = () => {
  const [place, setPlace] = useState('');
  const [quot, setQuot] =useState(1)
  const [category, setCategory] = useState('Masjid');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const area = {
        place,
     quot,
     isPermanet:false,
     isSpeacialPlace:false
    };



    // students: arrayUnion(student)

    try {
      const docRef = doc(db, 'cleaningPlace', category);
      await updateDoc(docRef, {
        cleaningPlace: arrayUnion(area)
      });
      alert('Area added successfully');
      setPlace('');
      setQuot(1)
    } catch (error) {
      console.error('Error adding Area: ', error);
      alert('Failed to add  Area');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
    <div className="form-group">
      <h2>Add Area</h2>
      <label className="form-label">Area:</label>
      <input 
        type="text" 
        className="form-input" 
        value={place} 
        onChange={(e) => setPlace(e.target.value)} 
        required 
      />
    </div>

    <div className="form-group">
      <label className="form-label">Quot:</label>
      <input 
        type="number" 
        className="form-input" 
        value={quot} 
        onChange={(e) => setQuot(e.target.value)} 
        required 
      />
    </div>



    <div className="form-group">
      <label className="form-label">Category:</label>
      <select 
        className="form-select" 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="Masjid">Masjid</option>
        <option value="MNC Outside">MNC Outside</option>
        <option value="MNC Ground Floor">MNC Ground Floor</option>
        <option value="MNC First Floor">MNC first Floor</option>
        <option value="MNC Second Floor">MNC Second Floor</option>
      </select>
    </div>
    <button className="form-button" type="submit">Submit</button>
  </form>
  
  );
};

export default AreaForm;
