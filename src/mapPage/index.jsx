import React, {useState, useEffect} from 'react'
import * as d3 from 'd3'
import Map from './../map'
import './styles.css'

function MapPage() {
  const [cities, setCities] = useState(null)
  const [routes, setRoutes] = useState(null)
  const [worldmap, setWorldmap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const worldmapData = await d3.json('countries.geojson')
        const citiesData = await d3.csv('cities.csv')
        const routesData = await d3.csv('routes.csv')
        setWorldmap(worldmapData)
        setCities(citiesData)
        setRoutes(routesData)
        setLoading(false)
      } catch (error) {
      }
    }
    loadData()
  }, [])

  const text = `Tania's trip to home continent.
August - October 2023`

  return (<>
    {loading && <div>Loading...</div>}
    {!!cities && <>
        <Map
          cities={cities}
          routes={routes}
          worldmap={worldmap}
        />
        <header className='header'>
          {text}
        </header>
      </>
    }
  </>)
}

export default MapPage
