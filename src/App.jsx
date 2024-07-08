import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { app } from '../src/firebase/config';

import CleaningList from "./pages/CleaningList/CleaningList";
import Navbar from "./components/Navbar/Navbar";
import StList from "./pages/StudentsList/StudentsList";
import Dashboard from "./pages/Dashboard/Dashboard";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import CleaningArea from "./pages/CleaningArea/CleaningArea";
import AddArea from "./pages/Add-Components/AddArea";
import CleaningManagement from "./pages/Add-Components/test";
import AddStudent from "./pages/Add-Components/AddStudents";
import PermanentList from "./pages/PermanentList/PermanentList";
import AddPermanentList from "./pages/Add-Components/AddPermanentList";
import CleaningListPage from "./pages/Add-Components/Finaldata";
import './App.css';
import GenerateNew from './pages/Add-Components/GenerateNew';
import Listed from './pages/Add-Components/listed';



const App = () => {

  const [cleaningList, setCleaningList] = useState([]);
  
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
  }, []);


  return (
    
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<WelcomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cleaning" element={<CleaningList data={cleaningList} />} />
          <Route path="/list" element={<StList />} />
          <Route path="/addStudent" element={<AddStudent />} />
          <Route path="/area" element={<CleaningArea />} />
          <Route path="/add-area" element={<AddArea />} />
          <Route path="/test" element={<CleaningManagement />} />
          <Route path="/permanent-list" element={<PermanentList />} />
          <Route path="/add-permanent" element={<AddPermanentList />} />
          <Route path="/show" element={<CleaningListPage />} />
          <Route path="/generate-new" element={<GenerateNew/>} />
          <Route path="/listed" element={<Listed/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
