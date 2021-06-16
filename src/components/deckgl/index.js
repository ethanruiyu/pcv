// ** React Imports
import { useState, useEffect, useCallback, useRef } from 'react'

// ** Third Party Components
import DeckGL from '@deck.gl/react'
import { DracoLoader } from '@loaders.gl/draco';
import { LASLoader } from '@loaders.gl/las';
import { PLYLoader } from '@loaders.gl/ply';
import { PCDLoader } from '@loaders.gl/pcd';
import { OBJLoader } from '@loaders.gl/obj';
import { load, registerLoaders } from '@loaders.gl/core';
import { OrbitView, COORDINATE_SYSTEM } from '@deck.gl/core'
import { LineLayer, PointCloudLayer } from '@deck.gl/layers'
import { observer } from 'mobx-react-lite'
import { DataFilterExtension } from '@deck.gl/extensions';

// ** Mobx
import Mobx from '../../mobx'

registerLoaders([DracoLoader, LASLoader, PLYLoader, PCDLoader, OBJLoader]);

const axisData = [
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
]

function concatTypedArrays(a, b) { // a, b TypedArray of same type
  var c = new (a.constructor)(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

function getIntensityColorRamp(reflectionMap) {
  let ret = {}
  if (reflectionMap < 30) {
    const green = (reflectionMap * 255 / 30)
    ret.r = 0
    ret.g = green & 0xff
    ret.b = 0xff
  } else if (reflectionMap < 90) {
    const blue = (((90 - reflectionMap) * 255) / 60)
    ret.r = 0x0
    ret.g = 0xff
    ret.b = blue & 0xff
  } else if (reflectionMap < 150) {
    const red = ((reflectionMap - 90) * 255 / 60);
    ret.r = red & 0xff;
    ret.g = 0xff;
    ret.b = 0x0;
  } else {
    const green = (((255 - reflectionMap) * 255) / (255 - 150));
    ret.r = 0xff;
    ret.g = green & 0xff;
    ret.b = 0;
  }

  return new Uint8Array([ret.r, ret.g, ret.b])
}

function calculateBounds(attributes) {
  const mins = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
  const maxs = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];

  const pointSize = attributes.POSITION.size;
  const pointCount = attributes.POSITION.value.length / pointSize;

  for (let i = 0; i < pointCount; i += pointSize) {
    const x = attributes.POSITION.value[i];
    const y = attributes.POSITION.value[i + 1];
    const z = attributes.POSITION.value[i + 2];

    if (x < mins[0]) mins[0] = x;
    else if (x > maxs[0]) maxs[0] = x;

    if (y < mins[1]) mins[1] = y;
    else if (y > maxs[1]) maxs[1] = y;

    if (z < mins[2]) mins[2] = z;
    else if (z > maxs[2]) maxs[2] = z;
  }

  return { mins, maxs };
}

const TopViewState = {
  target: [0, 0, 0],
  rotationX: 90,
  rotationOrbit: -45,
  // fov: 50,
  minZoom: 0,
  maxZoom: 10,
  zoom: 5
}

const OrbitViewState = {
  target: [0, 0, 0],
  rotationX: 45,
  rotationOrbit: -45,
  orbitAxis: 'Y',
  // fov: 50,
  minZoom: 0,
  maxZoom: 10,
  zoom: 5
}


const View = observer(() => {
  const [viewState, setViewState] = useState(OrbitViewState)
  const [axisHide, setAxisHide] = useState(true)
  const [view, setView] = useState(new OrbitView())
  const [pointData, setPointData] = useState([])
  const [pointSize, setPointSize] = useState(0.5)
  const deckRef = useRef()

  const axisLayer = new LineLayer({
    id: 'axis-layer',
    data: axisData,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getNormal: [255, 255, 255],
    getColor: d => d.color,
    getSourcePosition: d => d.start,
    getTargetPosition: d => d.end,
    opacity: 0.8,
    getWidth: 2,
    visible: axisHide
  })

  const pointCloudLayer = new PointCloudLayer({
    id: 'point-cloud-layer',
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    data: pointData,
    getNormal: [0, 1, 0],
    getColor: [255, 255, 255],
    opacity: 1,
    pointSize: pointSize,
    material: {
      // ambient: 0.5,
      // diffuse: 0.5,
      // shininess: 1000,
      // specularColor: [255, 255, 255]
    }
  })

  function convertLoadersMeshToDeckPointCloudData(attributes) {
    let deckAttributes = {
      getPosition: {}
    }
    let length = 0
    if (Mobx.density < 30) {
      const filter = { size: attributes.POSITION.size, value: new attributes.POSITION.value.constructor }
      for (let i = 0; i < attributes.POSITION.value.length; i += 3) {
        if ((i / 3) % Math.abs(30 - Mobx.density) === 0) {
          filter.value = concatTypedArrays(filter.value, new Float32Array([attributes.POSITION.value[i], attributes.POSITION.value[i + 1], attributes.POSITION.value[i + 2]]))
        }
      }
      deckAttributes = {
        getPosition: filter
      };
      length = filter.value.length / filter.size
    } else {
      deckAttributes = {
        getPosition: attributes.POSITION
      };
      length = attributes.POSITION.value.length / attributes.POSITION.size
    }


    if (Mobx.colorization === 0) {
      if (attributes.COLOR_0) {
        deckAttributes.getColor = attributes.COLOR_0;
      } else {
        deckAttributes.getColor = {}
      }
    } else if (Mobx.colorization === 1) {
      deckAttributes.getColor = {}
    } else if (Mobx.colorization === 2) {
      if (attributes.intensity) {
        const getColor = { value: new Uint8Array(), normalized: true, size: 3 }
        for (let i = 0; i < attributes.intensity.value.length; i++) {
          const rgb = getIntensityColorRamp(attributes.intensity.value[i])
          getColor.value = concatTypedArrays(getColor.value, rgb)
        }
        deckAttributes.getColor = getColor;
      } else {
        deckAttributes.getColor = {}
      }
    }
    // Check PointCloudLayer docs for other supported props?
    return {
      length,
      attributes: deckAttributes
    };
  }

  const _onLoad = ({ header, loaderData, attributes, progress }) => {
    const { maxs, mins } =
      loaderData.header.mins && loaderData.header.maxs
        ? loaderData.header
        : calculateBounds(attributes);

    setViewState({
      ...OrbitViewState,
      target: [(mins[0] + maxs[0]) / 2, (mins[1] + maxs[1]) / 2, (mins[2] + maxs[2]) / 2],
      zoom: Math.log2(window.innerWidth / (maxs[0] - mins[0])) - 1
    })

    const data = convertLoadersMeshToDeckPointCloudData(attributes)
    console.log(data)
    setPointData(data)
  }

  const handleViewStateChange = useCallback(({ viewState }) => {
    // Manipulate view state
    // viewState.target[0] = Math.min(viewState.target[0], 10);
    // Save the view state and trigger rerender
    setViewState(viewState);
  }, []);

  useEffect(() => {
    load('/example-files/bunny.obj').then(_onLoad)

    document
      .getElementById("deckgl-wrapper")
      .addEventListener("contextmenu", evt => evt.preventDefault());
  }, [])

  useEffect(() => {
    if (Mobx.exampleFile !== null) {
      load(`/example-files/${Mobx.exampleFile}`).then(_onLoad)
    }
  }, [Mobx.colorization])

  useEffect(() => {
    setPointSize(Mobx.pointSize)
  }, [Mobx.pointSize])

  useEffect(() => {
    if (Mobx.exampleFile !== null) {
      setPointData(null)
      load(`/example-files/${Mobx.exampleFile}`).then(_onLoad)
    }
  }, [Mobx.exampleFile])

  useEffect(() => {
    if (Mobx.exampleFile !== null) {
      load(`/example-files/${Mobx.exampleFile}`).then(_onLoad)
    }
  }, [Mobx.density])

  return (
    <div className='h-100 position-relative'>
      <DeckGL
        ref={deckRef}
        id='deck'
        layers={[axisLayer, pointCloudLayer]}
        initialViewState={OrbitViewState}
        views={view}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        parameters={{
          clearColor: [0, 0, 0, 1]
        }}
        controller={true}
      />
    </div>
  )
})

export default View