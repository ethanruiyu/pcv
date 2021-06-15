// ** Third Party Components
import {
  Row,
  Col
} from 'reactstrap'

// ** Custom Components
import View from './components/deckgl'
import Sidebar from './components/sidebar'

const App = props => {
  return (
    <div className='h-100'>
      <Row className='h-100 m-0'>
        <Col xl='3' className='h-100 p-0'>
          <Sidebar />
        </Col>
        <Col xl='9'>
          <View />
        </Col>
      </Row>
    </div>
  )
}

export default App