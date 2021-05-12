import { Card, CardHeader, CardTitle, CardBody, Row, Col } from 'reactstrap'

export const Sidebar = ({
  onChange
}) => {
  return (
    <Card className='h-100 border border-0 rounded-0' body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
      <CardHeader>
        <CardTitle>
          <h5>The Point Cloud Viewer</h5>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xl='6'>
            <span>File Format</span>
          </Col>
          <Col xl='6'>
            <span></span>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xl='6'>
            <span>Show Axis</span>
          </Col>
          <Col xl='6'>
            <select className='w-100' onChange={(e) => { onChange({ showAxis: e.target.value }) }}>
              <option value='1'>true</option>
              <option value='0'>false</option>
            </select>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xl='6'>
            <span>Point Size</span>
          </Col>
          <Col xl='6'>
            <select className='w-100' onChange={(e) => { onChange({ pointSize: e.target.value }) }}>
              <option value='0.3'>1</option>
              <option value='0.6'>2</option>
              <option value='1.2'>3</option>
            </select>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}