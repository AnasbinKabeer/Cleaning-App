import { useNavigate } from 'react-router-dom';
import './style.css';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase/config';

const db = getFirestore(app);

function CleaningArea() {
    const navigate = useNavigate();
    const handleAddArea = () => {
        navigate('/add-area');
    };

    const [cleaningPlace, setCleaningPlace] = useState([]);
    const [category, setCategory] = useState('Masjid');
    const [editingIndex, setEditingIndex] = useState(null);
    const [newQuot, setNewQuot] = useState('');

    const fetchData = async (category) => {
        try {
            const docRef = doc(db, 'cleaningPlace', category);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCleaningPlace(docSnap.data().cleaningPlace || []);
            } else {
                console.log('No such document!');
                setCleaningPlace([]);
            }
        } catch (error) {
            console.error('Error fetching document: ', error);
            setCleaningPlace([]);
        }
    };

    useEffect(() => {
        fetchData(category);
    }, [category]);

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewQuot(cleaningPlace[index].quot);
    };

    const handleSaveClick = async (index) => {
        const updatedCleaningPlace = [...cleaningPlace];
        updatedCleaningPlace[index].quot = newQuot;
        setCleaningPlace(updatedCleaningPlace);
        setEditingIndex(null);

        try {
            const docRef = doc(db, 'cleaningPlace', category);
            await updateDoc(docRef, { cleaningPlace: updatedCleaningPlace });
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    return (
        <div className='ca-container'>
            <div className="ca-uppermain">
                <div className="ca-left-uppermain"><h2>Total: 200</h2></div>
                <div className="ca-right-uppermain">
                    <button onClick={handleAddArea} className="Btn-add">Add New Area<IoIosAddCircleOutline className='add-icon' /></button>
                </div>
            </div>

            <div className="ca-data-div">
                <div className="ca-table-link">
                    <div className={category === 'Masjid' ? 't-link active' : "t-link"} onClick={() => setCategory('Masjid')}>Masjid</div>
                    <div className={category === 'MNC Outside' ? 't-link active' : "t-link"} onClick={() => setCategory('MNC Outside')}>MNC Outside</div>
                    <div className={category === 'MNC First Floor' ? 't-link active' : "t-link"} onClick={() => setCategory('MNC First Floor')}>MNC First Floor</div>
                    <div className={category === 'MNC Second Floor' ? 't-link active' : "t-link"} onClick={() => setCategory('MNC Second Floor')}>MNC Second Floor</div>
                    <div className={category === 'MNC Ground Floor' ? 't-link active' : "t-link"} onClick={() => setCategory('MNC Ground Floor')}>MNC Ground Floor</div>
                </div>
                <div className="ca-table-data">
                    <center>
                        <table>
                            <thead>
                                <tr>
                                    <th className='ca-t-main-no'>No</th>
                                    <th className='t-main-place'>Area</th>
                                    <th className='t-main-quota'>Staff quota</th>
                                    <th className='t-main-edit'>Edit</th>
                                    <th className='ca--main-edit'>Enable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cleaningPlace.map((place, index) => (
                                    <tr key={index}>
                                        <td className='ca-t-no'>{index + 1}</td>
                                        <td className='t-place'>{place.place}</td>
                                        <td className='t-quota'>
                                            {editingIndex === index ? (
                                                <input className='t-quota-input'
                                                    type="number"
                                                    value={newQuot}
                                                    onChange={(e) => setNewQuot(e.target.value)}
                                                />
                                            ) : (
                                                place.quot
                                            )}
                                        </td>
                                        <td className="ca-t-edit">
                                            {editingIndex === index ? (
                                                <button className='save-btn'  onClick={() => handleSaveClick(index)}>Save</button>
                                            ) : (
                                                <button className='edit-btn' onClick={() => handleEditClick(index)}>Edit</button>
                                            )}
                                        </td>
                                        <td className='t-edit'><button >Enable</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default CleaningArea;
