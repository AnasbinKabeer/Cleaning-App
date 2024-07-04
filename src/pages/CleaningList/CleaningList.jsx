import './style.css'
import { IoIosAddCircleOutline } from "react-icons/io";

function CleaningList() {
  return (
    <div className='cl-container'>
      <div className="uppermain">
      <div className="left-uppermain"><h2>Total: 200</h2></div>
        <div className="right-uppermain">
          <button  className="Btn-add">Generate New<IoIosAddCircleOutline  className='add-icon' /></button>
        </div>
      </div>

      <div className="data-div">
        <div className="table-link">
          <div className="t-link ">Masjid</div>
          <div className="t-link active">MNC Outside</div>
          <div className="t-link">MNC First Floor</div>
          <div className="t-link">MNC Second Floor</div>
          <div className="t-link">MNC Third Floor</div>

        </div>
        <div className="table-data">
          <center>
          <table>
            <tr>
              <th className='t-main-no'>No</th>
              <th className='t-main-place'>Cleaning Place</th>
              <th className='t-main-name'>Name</th>
              <th className='t-main-edit'>  Status</th>
            </tr>

            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td className='t-edit'><input type="checkbox" /></td>
            </tr>

            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>


            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>

            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>


            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>

            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>

            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>

            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>

            <tr>
              <td className='t-no'>1</td>
              <td className='t-place'>Bathroom</td>
              <td className='t-name'>Ismail Shaji</td>
              <td><input type="checkbox" /></td>
            </tr>
            
          </table>
          </center>

       
        </div>
        <div className='t-btns'>
        <button className='print-btn btn'>Print</button>
        <button className='submit-btn btn'> Submit</button>
        </div>
      </div>

    </div>
  )
}

export default CleaningList
