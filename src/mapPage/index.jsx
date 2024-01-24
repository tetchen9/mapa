import React, {useState, useEffect} from 'react'
import * as d3 from 'd3'
import Map from 'map'
import './styles.css'

const title = `Tania's trip to home continent. August - October 2023`

function MapPage() {
  const [cities, setCities] = useState(null)
  const [routes, setRoutes] = useState(null)
  const [worldmap, setWorldmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('')

  const imageSource =  `${process.env.PUBLIC_URL}/citiesphotos/${selectedCity}.jpg`

  useEffect(() => {
    loadData()
  }, [])

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
      console.error(error)
    }
  }

  return (<>
    {loading && <div>Loading...</div>}
    {!!cities && <>
      <Map
        cities={cities}
        routes={routes}
        worldmap={worldmap}
        setSelectedCity={setSelectedCity}
      />
      <section className='leftPanel'>
        <header className='header'>
          {title}
        </header>
        {!!selectedCity && <>
          <img className='cityPhoto' src={imageSource} />
          <span className='cityLabel'>{selectedCity}</span>
        </>}
      </section>
  </>}
  </>
  )
}

export default MapPage
