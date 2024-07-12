// App.js

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { app, auth } from './firebase/config'; // Adjust the import path as per your setup
import { onAuthStateChanged } from 'firebase/auth'; // Firebase authentication import

import CleaningList from './pages/CleaningList/CleaningList';
import Navbar from './components/Navbar/Navbar';
import StList from './pages/StudentsList/StudentsList';
import WelcomePage from './components/WelcomePage/WelcomePage';
import CleaningArea from './pages/CleaningArea/CleaningArea';
import AddArea from './pages/Add-Components/AddArea';
import CleaningManagement from './pages/Add-Components/test';
import AddStudent from './pages/Add-Components/AddStudents';
import PermanentList from './pages/PermanentList/PermanentList';
import AddPermanentList from './pages/Add-Components/AddPermanentList';
import CleaningListPage from './pages/Add-Components/Finaldata';
import GenerateNew from './pages/Add-Components/GenerateNew';
import Listed from './pages/Add-Components/listed';
import Login from './pages/Login/Login';

const App = () => {
  const [cleaningList, setCleaningList] = useState([]);
  const [user, setUser] = useState(null); // State to track authenticated user
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchCleaningList = async () => {
      const db = getFirestore(app);
      const cleaningListRef = collection(db, 'cleaningList');
      const q = query(cleaningListRef, orderBy('generatedDate', 'desc'), limit(1));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const finalData = latestDoc.data().finalData;
          setCleaningList(finalData);
          console.log('Cleaning List:', finalData);
        }
      } catch (error) {
        console.error('Error fetching cleaning list:', error);
      }
    };

    fetchCleaningList();

    // Firebase authentication listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  if (loading) {
    return <div className='loading-to-container'> <div className='loading-to'> Loading...</div></div>; // Show a loading state while checking authentication
  }

  return (
    <div className="App">
      <Router>
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={user ? <WelcomePage /> : <Navigate to="/login" replace />} />
          <Route path="/cleaning" element={user ? <CleaningList data={cleaningList} /> : <Navigate to="/login" replace />} />
          <Route path="/list" element={user ? <StList /> : <Navigate to="/login" replace />} />
          <Route path="/addStudent" element={user ? <AddStudent /> : <Navigate to="/login" replace />} />
          <Route path="/area" element={user ? <CleaningArea /> : <Navigate to="/login" replace />} />
          <Route path="/add-area" element={user ? <AddArea /> : <Navigate to="/login" replace />} />
          <Route path="/test" element={user ? <CleaningManagement /> : <Navigate to="/login" replace />} />
          <Route path="/permanent-list" element={user ? <PermanentList /> : <Navigate to="/login" replace />} />
          <Route path="/add-permanent" element={user ? <AddPermanentList /> : <Navigate to="/login" replace />} />
          <Route path="/show" element={user ? <CleaningListPage /> : <Navigate to="/login" replace />} />
          <Route path="/generate-new" element={user ? <GenerateNew /> : <Navigate to="/login" replace />} />
          <Route path="/listed" element={user ? <Listed /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
