import React, {useRef, useEffect, useState} from 'react'
import * as d3 from 'd3'
import { positionText } from './utils.js'
import './styles.scss'

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width: width - 10,
    height: height - 10,
  }
}
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }
  window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return windowDimensions
}

function Map({
  cities, 
  routes, 
  worldmap,
  setSelectedCity,
  setSelectedRoute,
}) {
  const d3Container = useRef(null)

  const { height: h, width: w } = useWindowDimensions()
  
  useEffect(() => {
    if (d3Container.current) {

      const formattedCities = positionText(cities)
  
      const svg = d3.select(d3Container.current)
      const g = svg.select('g')

      let projection = d3.geoMercator()
        .translate([w/2, h/2])
        // .scale(1180)
        .scale(w-100)
        .center([-8,46])
      let path = d3.geoPath().projection(projection)

      // draw map
      drawMapOfCountries(g, path)
      drawLines(g, projection)
      writeCitiNamesLabels(g, formattedCities, projection)
      drawPointsForCities(g, projection)
    }
  }, [])
    
  const drawPointsForCities = (g, projection) => {
    g.selectAll("circle")
    .data(cities)
    .enter()
    .append("circle")
    .attr("class","circles")
    .attr("cx", d => projection([d.Longitude, d.Lattitude])[0])
    .attr("cy", d => projection([d.Longitude, d.Lattitude])[1])
    .attr("r", "1px")
    .attr("city", d => d.City)
  }

  const drawLines = (g, projection) => {
    g.selectAll("line")
      .data(routes)
      .enter()
      .append("line")
      .attr("x1", (d, i) => {
        if (i + 1 < routes.length) {
          return projection([d.Longitude, d.Lattitude])[0]
        }
      })
      .attr("y1", (d, i) => {
        if (i + 1 < routes.length) {
          return projection([d.Longitude, d.Lattitude])[1]
        }
      })
      .attr("x2", (d, i) => {
        if (i + 1 < routes.length) {
          return projection([routes[i + 1].Longitude, routes[i + 1].Lattitude])[0]
        }
      })
      .attr("y2", (d, i) => {
        if (i + 1 < routes.length) {
          return projection([routes[i + 1].Longitude, routes[i + 1].Lattitude])[1]
        }
      })
      .style('stroke',  (d, i) => {
        if (i + 1 < routes.length) {
          return routes[i + 1]?.transport === 'Flight' ? '#dc140a' : 'teal'
        }
      })
      .style('stroke-width', 2)
      .style('stroke-dasharray', 2)
      .on('mouseover', function (from, i) {
        const to = routes[i + 1]
        setSelectedRoute(`${to.transport} from ${from.City} to ${to.City} `)
        d3.select(this)
        .style('stroke-width', 3)
        .style('stroke-dasharray', "2px 0")
      })
      .on('mouseout', function (d) {
        const route = d3.select(this)
        setTimeout(() => {
          route.style('stroke-width', 2)
          .style('stroke-dasharray', 2)
        }, 1000)
      })
    }

  const writeCitiNamesLabels = (g, formattedCities, projection) => {
    g.selectAll("text")
      .data(formattedCities)
      .enter()
      .append("text")
      .text(d => d.City)
      .attr("x", d => projection([d.textX || d.Longitude, d.textY || d.Lattitude])[0] + 3)
      .attr("y", d => projection([d.textX || d.Longitude, d.textY || d.Lattitude])[1] + 10)
      .attr("class", "labels")
      .on('mouseover', function (d) {
        setSelectedCity(d.City)
        d3.select(this)
        .style("font-weight", 500)
        .style("font-size", 14)
      })
      .on('mouseout', function (d) {
        d3.select(this)
        .style("font-weight", 400)
        .style("font-size", 10)
      })
    }
      
  const drawMapOfCountries = (g, path) => {
    g.selectAll("path")
      .data(worldmap.features)
      .enter()
      .append("path")
      .attr("class", d => `continent country-${d.id}`)
      .attr("d", path)
  }

  return (<>
    <svg
        className="d3-component"
        width={w}
        height={h}
        ref={d3Container}
        viewBox={`0 0 ${w} ${h}`}
        >
      <g></g>
    </svg>
    <div className='placeholder'>Please open the map on a laptop</div>
  </>
  )

}

export default Map
