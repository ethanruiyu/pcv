import { Card, CardHeader, CardTitle, CardBody, Row, Col } from 'reactstrap'

export const Sidebar = ({}) => {
  return (
    <Card className='h-100 border border-0 rounded-0'  body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
      <CardHeader>
        <CardTitle>
          The Point Cloud Viewer
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xl='6'>
            <span>Point Size</span>
          </Col>
          <Col xl='6'>
            <select className='w-100'>
              <option value='1'>1</option>
              <option value='1'>2</option>
              <option value='1'>3</option>
            </select>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}