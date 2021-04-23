import React, { useState } from 'react'
import DeckGL from '@deck.gl/react';
import { OrbitView } from '@deck.gl/core';
import { Row, Col, Container } from 'reactstrap'
import { Sidebar } from './widgets/Sidebar'
import { LineLayer } from '@deck.gl/layers';

import './App.css';

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

  const layers = [
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
  return (
    <div className='app' fluid={true}>
      <Row className='h-100 m-0'>
        <Col className='p-0 h-100' xl='2'>
          <Sidebar />
        </Col>
        <Col className='p-0 h-100' xl='10'>
          <DeckGL
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
