
// ** Third Party Components
import { ChevronLeft, ChevronRight } from 'react-feather'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

const Sidebar = props => {
  const { collapsed, setCollapsed } = props

  const Toggler = () => {
    if (!collapsed) {
      return (
        <ChevronLeft
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setCollapsed(true)}
        />
      )
    } else {
      return (
        <ChevronRight
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setCollapsed(false)}
        />
      )
    }
  }

  return (
    <Card className='h-100 p-0 bg-dark text-light'>
      <CardHeader>
        <CardTitle className='ml-5' tag='h4'>
          Point Cloud Viewer
        </CardTitle>
      </CardHeader>
      <CardBody>
        123
      </CardBody>
    </Card>
  )
}

export default Sidebar