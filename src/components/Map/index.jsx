import React, { useState } from 'react';
import { geoCentroid, geoAlbers } from 'd3-geo';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from 'react-simple-maps';
import './styles.scss';

import allStates from 'data/allstates.json';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const colors = [
  '#00C78E',
  '#8C3ED4',
  '#FA8A5A',
  '#2F80ED',
  '#C79B00',
  '#FFC998',
  '#5AC0FA',
  '#8EBF00',
  '#DE4605',
  '#4154AA'
];

const markers = [
  {
    markerOffset: 15,
    name: 'Classic brands - east',
    coordinates: [-119.47, 37.18]
  },
  {
    markerOffset: 15,
    name: 'Classic brands - west ',
    coordinates: [-111.67, 39.3]
  },
  {
    markerOffset: 15,
    name: 'Classic brands - Huston ',
    coordinates: [-94.3, 46.28]
  },
  { markerOffset: 15, name: 'Elite', coordinates: [-92.45, 38.35] }
];

const Map = ({ setContent }) => {
  const [brands, setBrands] = useState({
    0: {
      arr: [],
      color: '#00C78E'
    },

    1: {
      arr: [],
      color: '#8C3ED4'
    },

    2: {
      arr: [],
      color: '#FA8A5A'
    }
  });

  const [current, setCurrent] = useState(0);

  const onGeographyClick = geo => {
    for (const [key, value] of Object.entries(brands)) {
      if (parseInt(key) === current) continue;

      const isExist = !!value.arr.find(id => geo.id === id);
      if (isExist) {
        alert('This state is already selected by another warehouse');
        return;
      }
    }

    const isExist = !!brands[current].arr.find(id => geo.id === id);

    if (isExist) {
      const newArr = brands[current].arr.filter(item => item !== geo.id);

      setBrands({
        ...brands,
        [current]: {
          ...brands[current],
          arr: newArr
        }
      });
    } else {
      setBrands({
        ...brands,
        [current]: {
          ...brands[current],
          arr: [...brands[current].arr, geo.id]
        }
      });
    }
  };

  const handleGroupState = () => {
    const maxStates = Object.keys(brands).length - 1;

    if (current !== maxStates) {
      setCurrent(current + 1);
    } else {
      setCurrent(0);
    }
  };

  const getColorForGeography = geoId => {
    for (const brand of Object.values(brands)) {
      const isExist = !!brand.arr.find(id => id === geoId);

      if (isExist) {
        return brand.color;
      }
    }

    return '#ffffff';
  };

  const getColorOnHover = () => {
    const lighterColor = brands[current].color.slice(0, -1) + 'b98';

    return lighterColor;
  };

  return (
    <div>
      <div>
        <p>Current: {current}</p>
        <div
          style={{
            background: brands[current].color,
            width: '30px',
            height: '30px'
          }}
        ></div>
      </div>

      <div className='map'>
        <ComposableMap projection='geoAlbers' data-tip=''>
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              return (
                <>
                  {geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      stroke='#9296A8'
                      geography={geo}
                      fill='#FFF'
                      style={{
                        hover: {
                          fill: getColorOnHover(),
                          outline: 'none'
                        },
                        pressed: {
                          outline: 'none'
                        },
                        default: {
                          outline: 'none',
                          fill: getColorForGeography(geo.id)
                        }
                      }}
                      onClick={() => onGeographyClick(geo)}
                    />
                  ))}

                  {markers.map(({ name, coordinates, markerOffset }) => (
                    <Marker
                      key={name}
                      coordinates={coordinates}
                      onMouseEnter={() => setContent(name)}
                      onMouseLeave={() => setContent('')}
                    >
                      <g transform='translate(-12, -24)'>
                        <path
                          d='M9.89272 26.8788C13.1001 22.7688 19.2381 14.0835 19.2381 10.113C19.2381 5.02486 15.0542 0.900391 9.89272 0.900391C4.73128 0.900391 0.547363 5.02486 0.547363 10.113C0.547363 14.0865 6.68533 22.7703 9.89272 26.8788ZM9.89272 4.99487C12.1865 4.99487 14.0462 6.82819 14.0462 9.08935C14.0462 11.3505 12.1865 13.1838 9.89272 13.1838C7.59897 13.1838 5.73923 11.3505 5.73923 9.08935C5.73923 6.82819 7.59897 4.99487 9.89272 4.99487Z'
                          fill='#2A676F'
                        />
                      </g>
                    </Marker>
                  ))}
                </>
              );
            }}
          </Geographies>
        </ComposableMap>
      </div>

      <button onClick={handleGroupState}>Group states</button>
    </div>
  );
};

export default Map;
