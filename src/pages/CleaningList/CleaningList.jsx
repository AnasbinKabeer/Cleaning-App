import { useState, useRef } from 'react';
import './style.css';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import Nd from '../../assets/ND-Header.png'

function CleaningList({ data }) {
  const [activeFilter, setActiveFilter] = useState('MNC Outside'); // Default active filter
  const navigate = useNavigate();
  const tableRef = useRef(); // Ref for table or data container

  const filteredData = data.filter(item => item.category === activeFilter);

  const handleGenerate = () => {
    navigate('/test'); // Example navigation function
  };

  return (
    <div className='cl-container'>
      <div className="uppermain">
        <div className="left-uppermain"><h2>Total: {filteredData.length}</h2></div>
        <div className="right-uppermain">
          <button className="Btn-add" onClick={handleGenerate}>Generate New<IoIosAddCircleOutline className='add-icon' /></button>
          
        </div>
      </div>

      <div className="data-div">
        <div className="table-link">
          {/* Filter buttons */}
          {['Masjid', 'MNC Outside', 'MNC First Floor', 'MNC Second Floor', 'MNC Ground Floor'].map(filter => (
            <div
              key={filter}
              className={`t-link ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </div>
          ))}

        </div>

        <div className="table-data" ref={tableRef}>
          {/* Table data */}
          <div className="nd-header"><img src={Nd} width={"100%"} alt="" /></div>
         
          <center  className='tablee'>
          <h1 className='category'>{activeFilter}</h1>
            <table>
              <thead>
                <tr>
                  <th className='cl-t-main-no'>No</th>
                  <th className='t-main-place'>Cleaning Place</th>
                  <th className='t-main-name'>Name</th>
                  <th className='t-main-edit'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className='cl-t-no'>{index + 1 + ")"}</td>
                    <td className='cl-t-place'>{item.place}</td>
                    <th className='colun'>:</th>
                    <td className='cl-t-name'>{item.students.join(', ')}</td>
                    <td className='cl-t-edit'>
                      <input type="checkbox" defaultChecked={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
              

            </table>
          </center>
          
        </div>
     
        <div className='t-btns'>
        <ReactToPrint
            trigger={() => (
              <button className="print-btn btn">Print</button> 
            )}
            content={() => tableRef.current} 
          />  
          {/* Submit button or other buttons */}
         
          {/* <button className='submit-btn btn'>Submit</button> */}
          
        </div>
      </div>
    </div>
  );
}

export default CleaningList;
