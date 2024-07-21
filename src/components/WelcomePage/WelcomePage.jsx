import './style.css'
import { useState,useEffect } from 'react';

import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Assuming the path is correct
import { Button,Collapse, List, ListItem} from '@mui/material';
import { styled } from '@mui/material/styles';



// Styled components
const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ToggleButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ListContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(),
}));



const db = getFirestore(app);

function WelcomePage() {


  const [students, setStudents] = useState([]);
  const [generatedList, setGeneratedList] = useState([]);
  const [permanentList, setPermanentList] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [multipleAssignedStudents, setMultipleAssignedStudents] = useState([]);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [showMultiple, setShowMultiple] = useState(false);

  // Fetch students collection
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, 'students');
        const studentsSnapshot = await getDocs(studentsRef);
        const studentsData = [];
        studentsSnapshot.forEach(doc => {
          const levelData = doc.data().students || [];
          levelData.forEach(student => {
            if (student.isPresent) {
              studentsData.push(student.name);
            }
          });
        });
        console.log('Students:', studentsData); // Debugging log
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Fetch generatedList collection
  useEffect(() => {
    const fetchGeneratedList = async () => {
      try {
        const generatedListRef = collection(db, 'generatedList');
        const generatedListSnapshot = await getDocs(generatedListRef);
        const generatedListData = [];

        generatedListSnapshot.forEach(doc => {
          const locationData = doc.data().data || [];
          locationData.forEach(item => {
            const assignedStudents = item.assignedStudents || [];
            assignedStudents.forEach(student => {
              generatedListData.push(student.name);
            });
          });
        });

        console.log('Generated List:', generatedListData); // Debugging log
        setGeneratedList(generatedListData);
      } catch (error) {
        console.error('Error fetching generated list:', error);
      }
    };

    fetchGeneratedList();
  }, []);

  // Fetch permanentList collection
  useEffect(() => {
    const fetchPermanentList = async () => {
      try {
        const permanentListRef = collection(db, 'permanentList');
        const permanentListSnapshot = await getDocs(permanentListRef);
        const permanentListData = [];
        
        permanentListSnapshot.forEach(doc => {
          const data = doc.data();
          const students = data.students || [];
          students.forEach(student => {
            permanentListData.push(student);
          });
        });

        console.log('Permanent List:', permanentListData); // Debugging log
        setPermanentList(permanentListData);
      } catch (error) {
        console.error('Error fetching permanent list:', error);
      }
    };

    fetchPermanentList();
  }, []);

  // Calculate unassigned and multiple assigned students
  useEffect(() => {
    const allAssignedStudents = new Set([...generatedList, ...permanentList]);
    const unassigned = students.filter(student => !allAssignedStudents.has(student));
    console.log('Unassigned Students:', unassigned); // Debugging log
    setUnassignedStudents(unassigned);

    const combinedList = [...generatedList, ...permanentList];
    const studentCounts = combinedList.reduce((counts, student) => {
      counts[student] = (counts[student] || 0) + 1;
      return counts;
    }, {});

    const multipleAssigned = Object.keys(studentCounts).filter(student => studentCounts[student] > 1);
    console.log('Multiple Assigned Students:', multipleAssigned); // Debugging log
    setMultipleAssignedStudents(multipleAssigned);
  }, [students, generatedList, permanentList]);







  const toggleUnassigned = () => {
    setShowUnassigned(!showUnassigned);
  };

  const toggleMultiple = () => {
    setShowMultiple(!showMultiple);
  };


  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  const size = 160;
  const fontSize = 45;
  const fontWeight = 700;
  const percentage = 85
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="welcomePage">
      <div className='left-div'>
        <div className="wl-header">Cleaning Dashboard</div>
        <div className="collapsible-container">
   
          
            <div className="content">
  
            <Container>
    

      <ToggleButton onClick={toggleUnassigned}>
        {showUnassigned ? 'Hide Unassigned Students' : 'Show Unassigned Students'}
      </ToggleButton>
      <Collapse in={showUnassigned}>
        <ListContainer>
          <List >
            {unassignedStudents.map((student, index) => (
              <ListItem className='listofunassigned' key={index}>{index+1+ ". "+student}</ListItem>
            ))}
          </List>
        </ListContainer>
      </Collapse>

      
    </Container>

            </div>

        </div>
<div>
</div>
     
      </div>
      <div className='right-div'>
        <div className="canvas-container">
          <h2 className='cl-h2'>Cleaning Status</h2>
          <svg width={size} height={size} className="circular-progress">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#FF8C04"
              strokeWidth="15"
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#5CE2FF"
              strokeWidth="15"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              fontSize={fontSize}
              fontWeight={fontWeight}
              fill="#fff"
            >
              {`${percentage}%`}
            </text>
          </svg>
        </div>

        <div className="collapsible-container">
          <div className="header" onClick={toggleExpand}>
            
          </div>
      <Container>
          
                <ToggleButton onClick={toggleMultiple}>
        {showMultiple ? 'Hide Multiple Assigned Students' : 'Show Multiple Assigned Students'}
      </ToggleButton>
      <Collapse in={showMultiple}>
        <ListContainer>
          <List>
            {multipleAssignedStudents.map((student, index) => (
              <ListItem className='listofunassigned' key={index}>{index+1+ ". "+student}</ListItem>
            ))}
          </List>
        </ListContainer>
      </Collapse>
      </Container>
        
        </div>


      </div>

    </div>
  )
}
export default WelcomePage
