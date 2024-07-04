import CleaningList from "./pages/CleaningList/CleaningList";
import Navbar from "./components/Navbar/Navbar";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StList from "./pages/StudentsList/StudentsList";
import Dashboard from "./pages/Dashboard/Dashboard";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import CleaningArea from "./pages/CleaningArea/CleaningArea";
import AddArea from "./pages/AddStudent/AddArea";
import CleaningManagement from "./pages/AddStudent/test";
import AddStudent from "./pages/AddStudent/AddStudents";


const App = () => {



  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<WelcomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cleaning" element={<CleaningList />} />
          <Route path="/list" element={<StList />} />
          <Route path="/addStudent" element={<AddStudent/>} />
          <Route path="/area" element={<CleaningArea />} />
          <Route path="/add-area" element={<AddArea />} />
          <Route path="/test" element={<CleaningManagement />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
