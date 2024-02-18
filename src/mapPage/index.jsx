import React, {useState, useEffect} from 'react'
import * as d3 from 'd3'
import Map from '../map'
import './styles.scss'

const title = `Tania's trip to Old World. August - October 2023`

function MapPage() {
  const [cities, setCities] = useState(null)
  const [routes, setRoutes] = useState(null)
  const [worldmap, setWorldmap] = useState(null)
  const [citiesNotes, setCitiesNotes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedRoute, setSelectedRoute] = useState('')

  const imageSource =  `${process.env.PUBLIC_URL}/citiesphotos/${selectedCity}.jpg`

  useEffect(() => {
    if(!cities) { loadData() }
  }, [])

  async function loadData() {
    try {
      const worldmapData = await d3.json('countries.geojson')
      const citiesData = await d3.csv('cities.csv')
      const routesData = await d3.csv('routes.csv')
      const citiesNotes = await d3.csv('cities_notes.csv')
      setWorldmap(worldmapData)
      setCities(citiesData)
      setRoutes(routesData)
      setCitiesNotes(citiesNotes)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const routesStats = routes?.reduce((acc, { transport }) => {
    const transportTypes = transport.split(' ')
    transportTypes.forEach(type => {
      acc[type] = acc[type] ? acc[type] + 1 : 1
    })
    return acc
  }
  , {})

  //count unique cities
  const citiesStats = cities?.length

  const countriesStats = new Set(cities?.map(city => city.Name))

  const tripSummary = !!routesStats && <div className='description'>
    <div>{`78 days, ${countriesStats.size} countries, ${citiesStats} towns and islands`}</div>
    {`${routesStats.Flight} flights, ${routesStats.Train} trains, ${routesStats.Blablacar} Blablacar rides, ${routesStats.Bus} bus rides, rented a car once`}
    <div className='routeLabel'>
      {!!selectedRoute ? selectedRoute : 'Hover over a route to see details'}
    </div>
  </div>

  const getNotes = (selectedCity) => {
    const cityNotes = citiesNotes?.filter(notes => notes.City === selectedCity)[0]
    const { Notes : notes } = cityNotes
    const notesList = notes?.split('|').map(note => <li>{note}</li>)
    return notes && <ul>{notesList}</ul>
  }

  return (<>
    {loading && <div>Loading...</div>}
    {!!cities && <>
      <section className='leftPanel'>
        <header className='header'>
          {title}
        </header>
        {tripSummary}
        {!!selectedCity && <div className='cityCard'>
          <img className='cityPhoto' src={imageSource} />
          <span className='cityLabel'>{selectedCity}</span>
          <div className='cityNotes'>{getNotes(selectedCity)}</div>
        </div>}
      </section>
      <Map
        cities={cities}
        routes={routes}
        worldmap={worldmap}
        setSelectedCity={setSelectedCity}
        setSelectedRoute={setSelectedRoute}
      />
  </>}
  </>
  )
}

export default MapPage
