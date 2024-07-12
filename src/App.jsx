// App.js

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { app,auth } from './firebase/config'; // Adjust the import path as per your setup
import { onAuthStateChanged } from 'firebase/auth'; // Firebase authentication import

import CleaningList from './pages/CleaningList/CleaningList';
import Navbar from './components/Navbar/Navbar';
import StList from './pages/StudentsList/StudentsList';
import Dashboard from './pages/Dashboard/Dashboard';
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
      if (user) {
        setUser(user); // User is signed in
      } else {
        setUser(null); // User is signed out
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  return (
    <div className="App">
      <Router>
        {user ? (
          <>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<WelcomePage />} />
              <Route path="/cleaning" element={<CleaningList data={cleaningList} />} />
              <Route path="/list" element={<StList />} />
              <Route path="/addStudent" element={<AddStudent />} />
              <Route path="/area" element={<CleaningArea />} />
              <Route path="/add-area" element={<AddArea />} />
              <Route path="/test" element={<CleaningManagement />} />
              <Route path="/permanent-list" element={<PermanentList />} />
              <Route path="/add-permanent" element={<AddPermanentList />} />
              <Route path="/show" element={<CleaningListPage />} />
              <Route path="/generate-new" element={<GenerateNew />} />
              <Route path="/listed" element={<Listed />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </Router>
    </div>
  );
};

export default App;
