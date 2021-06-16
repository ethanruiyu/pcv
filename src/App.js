import { useEffect } from 'react'
// ** Third Party Components
import {
  Row,
  Col,
  Spinner
} from 'reactstrap'

// ** Custom Components
import View from './components/deckgl'
import Sidebar from './components/sidebar'
import Mobx from './mobx'
import { observer } from 'mobx-react-lite'

const App = observer((props) => {
  return (
    <div className='h-100'>
      {
        Mobx.spinner && (
          <div
            className='fixed-bottom position-absolute p-0 m-0' style={{
              zIndex: '99999',
              top: '50%',
              left: '50%'
            }}
          >
            <Spinner color='light' />
          </div>
        )
      }

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
})

export default App