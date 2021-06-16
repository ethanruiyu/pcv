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
import Slider from 'rc-slider';

// ** Custom Components
import AppCollapse from '../app-collapse'
import themeConfig from '../../configs/themeConfig'

// ** Styles
import "react-perfect-scrollbar/dist/css/styles.css";
import 'rc-slider/assets/index.css';

// ** Mobx
import Mobx from '../../mobx'

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
  { value: 'bunny.obj', label: 'bunny.obj' },
  { value: 'france.laz', label: 'france.laz' },
  { value: 'house.laz', label: 'house.laz' },
  { value: 'richmond-azaelias.ply', label: 'richmond-azaelias.ply' }
]

const PointSizeOptions = [
  { value: 0.5, label: '1' },
  { value: 0.9, label: '2' },
  { value: 1.5, label: '4' }
]

const ColorizationOptions = [
  { value: 0, label: 'RGB' },
  { value: 1, label: 'Heightmap Color' },
  { value: 2, label: 'Intensity' }
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
            onChange={(e) => Mobx.exampleFileChange(e.value)}
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
            <Button outline color='info' onClick={() => Mobx.viewportChange(0)}>Orthographic</Button>
            <Button outline color='info' onClick={() => Mobx.viewportChange(1)}>Top-View</Button>
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
            onChange={(e) => Mobx.pointSizeChange(e.value)}
          />
        </div>
        <hr />
        <div className='p-3 bg-secondary'>
          <CardText>
            <span className='font-weight-bold'>Density</span>
          </CardText>
          <Slider min={0} max={30} step={3} defaultValue={30} onChange={(e) => Mobx.densityChange(e)} />
        </div>
        <hr />
        <div className='p-3 bg-secondary'>
          <CardText>
            <span className='font-weight-bold'>Colorization</span>
          </CardText>
          <Select
            styles={selectStyles}
            className='react-select w-100'
            defaultValue={ColorizationOptions[0]}
            options={ColorizationOptions}
            onChange={(e) => Mobx.colorizationChange(e.value)}
          />
        </div>
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
        <CardHeader className='d-flex'>
          <span className='brand-logo'>
            <img src={themeConfig.app.appLogoImage} alt='logo' />
          </span>
          <CardTitle tag='h2' className=' ml-2 row justify-content-center align-self-center'>
            Point Cloud Viewer
          </CardTitle>
        </CardHeader>
        <CardBody className='p-0'>
          <PerfectScrollbar component='div' style={{ maxHeight: window.innerHeight - 80 }}>
            <AppCollapse data={FileCollapse} active={[0]} />
            <AppCollapse data={DataCollapse} active={[0]} />
            <AppCollapse data={CameraCollapse} active={[0]} />
          </PerfectScrollbar>
        </CardBody>
      </Card>
    </div>
  )
}

export default Sidebar