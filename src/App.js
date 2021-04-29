import React, { useState } from 'react'
import DeckGL from '@deck.gl/react';
import { OrbitView, COORDINATE_SYSTEM, _CameraLight as CameraLight } from '@deck.gl/core';
import { Row, Col } from 'reactstrap'
import { Sidebar } from './widgets/Sidebar'
import { LineLayer, PointCloudLayer } from '@deck.gl/layers';
import { DracoLoader } from '@loaders.gl/draco'
import { LASLoader } from '@loaders.gl/las';
import { OBJLoader } from '@loaders.gl/obj';
import { registerLoaders } from '@loaders.gl/core';
import { load } from '@loaders.gl/core';
import './App.css';

registerLoaders([DracoLoader, LASLoader, OBJLoader]);

const App = () => {
  const [axis] = useState([
    {
      start: [0, 0, 0],
      end: [0, 1, 0],
      color: [255, 0, 0]
    },
    {
      start: [0, 0, 0],
      end: [1, 0, 0],
      color: [0, 255, 0]
    },
    {
      start: [0, 0, 0],
      end: [0, 0, 1],
      color: [0, 0, 255]
    },
  ])
  const [axisVisible, setAxisVisible] = useState(true)
  const [drag, setDrag] = useState(false)
  const [data, setData] = useState()
  const [pointSize, setPointSize] = useState(0.3)

  const layers = [
    new PointCloudLayer({
      id: 'point-cloud-layer',
      data: data,
      // loader: [DracoLoader],
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      getNormal: [255, 255, 255],
      getColor: [255, 255, 255],
      opacity: 1,
      pointSize: pointSize,
      material: {
        ambient: 1,
        diffuse: 1
      }
    }),
    new LineLayer({
      id: 'axis-layer',
      data: axis,
      getNormal: [255, 255, 255],
      getColor: d => d.color,
      getSourcePosition: d => d.start,
      getTargetPosition: d => d.end,
      opacity: 0.8,
      getWidth: 2,
      visible: axisVisible
    })
  ]

  const handleChange = (attrs) => {
    if (attrs.showAxis) {
      setAxisVisible(attrs.showAxis === '1')
    }
    if (attrs.pointSize) {
      setPointSize(parseFloat(attrs.pointSize))
    }
  }

  const handleDragEnter = () => {

  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  function convertLoadersMeshToDeckPointCloudData(attributes) {
    const deckAttributes = {
      getPosition: attributes.POSITION
    };
    if (attributes.COLOR_0) {
      deckAttributes.getColor = attributes.COLOR_0;
    }
    // Check PointCloudLayer docs for other supported props?
    return {
      length: attributes.POSITION.value.length / attributes.POSITION.size,
      attributes: deckAttributes
    };
  }

  const onMapLoad = ({ header, loaderData, attributes, progress }) => {
    console.log(attributes)
    let chunk = convertLoadersMeshToDeckPointCloudData(attributes)
    // console.log(chunk)
    setData(chunk)
    chunk = {}
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const b = new Blob([e.target.result])
        load(b, { worker: false }).then(onMapLoad);
      };
      reader.readAsArrayBuffer(e.dataTransfer.files[0])
    }
  }

  return (
    <div className='app'
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Row className='h-100 m-0'>
        <Col className='p-0 h-100' xl='2'>
          <Sidebar onChange={handleChange} />
        </Col>
        <Col className='p-0 h-100' xl='10'>
          <DeckGL
            light={[new CameraLight({
              color: [255, 255, 255],
              intensity: 1
            })]}
            parameters={{
              clearColor: [0, 0, 0, 1]
            }}
            initialViewState={{
              rotationX: 45,
              rotationOrbit: -45,
              zoom: 5,
              pitch: 0
            }}
            views={new OrbitView({
              minZoom: 0.1,
              maxZoom: 10,
              minRotationX: -90,
              maxRotationX: 90,
              target: [0, 0, 0]
            })}
            controller={true}
            layers={layers}
          />
        </Col>
      </Row>

    </div>
  );
}

export default App;
