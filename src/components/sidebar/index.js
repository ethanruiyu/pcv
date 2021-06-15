// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Button,
  ButtonGroup
} from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import classnames from 'classnames'
import { ChevronLeft, ChevronRight } from 'react-feather'
import Select from 'react-select'

// ** Custom Components
import AppCollapse from '../app-collapse'

const selectStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? '#17a2b8' : 'black',
    paddingLeft: 10,
    padding: 2
  })
}


const ExampleOptions = [
  { value: 0, label: 'bunny.obj' },
  { value: 1, label: 'bunny.drc' },
  { value: 2, label: 'bunny.las' }
]

const PointSizeOptions = [
  { value: 0.3, label: '1' },
  { value: 0.6, label: '2' },
  { value: 0.9, label: '4' }
]

const FileCollapse = [
  {
    title: 'FILE',
    content: (
      <div>
        <div className='p-3 bg-secondary'>
          <CardText>
            <span className='font-weight-bold'>Example File</span>
          </CardText>
          <Select
            styles={selectStyles}
            className='react-select w-100'
            defaultValue={ExampleOptions[0]}
            options={ExampleOptions}
          />
        </div>
        <hr />
        <div className='p-3 bg-secondary'>
          <CardText>
            <span className='font-weight-bold'>Upload File</span>
          </CardText>
          <Button outline color='info'>Browse</Button>
        </div>
      </div>
    )
  }
]

const CameraCollapse = [
  {
    title: 'CAMERA',
    content: (
      <div>
        <div className='p-3 bg-secondary'>
          <CardText>
            <span className='font-weight-bold'>Type</span>
          </CardText>
          <ButtonGroup className='mb-1'>
            <Button outline color='info' >First-Person</Button>
            <Button outline color='info' >Orthographic</Button>
            <Button outline color='info' >Top-View</Button>
          </ButtonGroup>
        </div>
        <hr />
        <div className='p-3 bg-secondary'>
          <CardText>
            <span className='font-weight-bold'>Reset Viewport</span>
          </CardText>
          <Button outline color='info'>Reset</Button>
        </div>
      </div>
    )
  }
]

const DataCollapse = [
  {
    title: 'DATA',
    content: (
      <div>
        <div className='p-3 bg-secondary'>
          <CardText>
            <span className='font-weight-bold'>Point Size</span>
          </CardText>
          <Select
            styles={selectStyles}
            className='react-select w-100'
            defaultValue={PointSizeOptions[0]}
            options={PointSizeOptions}
          />
        </div>
        <hr />
      </div>
    )
  }
]

const Sidebar = props => {
  const [collapsed, setCollapsed] = useState(true)

  const handleToggle = e => {
    e.preventDefault()
    setCollapsed(!collapsed)
  }

  return (
    <div className={classnames('sidebar d-none d-md-block m-0', {
      open: collapsed
    })}>
      <a href='/' className='sidebar-toggle d-flex align-items-center justify-content-center' onClick={handleToggle}>
        {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </a>
      <Card className='bg-dark text-light'>
        <CardHeader>
          <CardTitle tag='h4' className='row justify-content-center align-self-center'>
            Point Cloud Viewer
          </CardTitle>
        </CardHeader>
        <CardBody className='p-0'>
          <PerfectScrollbar component='div'>
            <AppCollapse data={FileCollapse} active={[0]} />
            <AppCollapse data={CameraCollapse} active={[0]} />
            <AppCollapse data={DataCollapse} active={[0]} />
          </PerfectScrollbar>
        </CardBody>
      </Card>
    </div>
  )
}

export default Sidebar