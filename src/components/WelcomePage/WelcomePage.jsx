import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './style.css'
import { useState } from 'react';


function WelcomePage() {

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
            <h5 className='lt-s'>Pending Tasks {isExpanded ? <FaChevronUp /> : <FaChevronDown />}</h5>
           
          </div>
          {isExpanded && (
            <div className="content">
              <span>1. Class Room</span>
              <span>2. Class Room</span>
              <span>3. Class Room</span>
            </div>
          )}
                 <div className="header" onClick={toggleExpand}>
            <h5 className='lt-s'>Excluded list</h5>
           
          </div>
        </div>


      </div>

    </div>
  )
}
export default WelcomePage
