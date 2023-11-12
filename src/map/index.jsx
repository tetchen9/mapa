import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import { positionText } from './utils.js'
import './map.css'

function Map({cities, routes, worldmap}) {
  const d3Container = useRef(null)

  const w = 1200
  const h = 700
  
  useEffect(() => {
      if (d3Container.current){

      const formattedCities = positionText(cities)
  
      const svg = d3.select(d3Container.current)
      const g = svg.select('g')

      let projection = d3.geoMercator().translate([w/2, h/2]).scale(1180).center([-6,46])
      let path = d3.geoPath().projection(projection)

      // draw map
      g.selectAll("path")
        .data(worldmap.features)
        .enter()
        .append("path")
        .attr("class", d => `continent country-${d.id}`)
        .attr("d", path)

      g.selectAll("line")
        .data(routes)
        .enter()
        .append("line")
        .attr("x1", (d, i) => {
          if (i+1 < routes.length) {
            return projection([d.Longitude, d.Lattitude])[0]
          }})
        .attr("y1", (d, i) => { 
          if (i+1 < routes.length) {
          return projection([d.Longitude, d.Lattitude])[1]
        }})
        .attr("x2", (d, i) => {
          if (i+1 < routes.length) {
            return projection([routes[i+1].Longitude, routes[i+1].Lattitude])[0]
          }
        })
        .attr("y2", (d, i) => {
          if (i+1 < routes.length) {
            return projection([routes[i+1].Longitude, routes[i+1].Lattitude])[1]
          }
        })
        .style('stroke', '#fff')
        .style('stroke-width', 2)
        .style('stroke-dasharray', 2)

        // add labels
        g.selectAll("text")
        .data(formattedCities)
        .enter()
        .append("text")
        .text(d => d.City)
        .attr("x", d => projection([d.textX || d.Longitude, d.textY || d.Lattitude])[0] + 3)
        .attr("y", d => projection([d.textX || d.Longitude, d.textY || d.Lattitude])[1] + 10)
        .attr("class","labels")

        // draw points
        g.selectAll("circle")
          .data(cities)
          .enter()
          .append("circle")
          .attr("class","circles")
          .attr("cx", d => projection([d.Longitude, d.Lattitude])[0])
          .attr("cy", d => projection([d.Longitude, d.Lattitude])[1])
          .attr("r", "1px")
    }
    }, [])
   
  return (
    <svg
        className="d3-component"
        width={w}
        height={h}
        ref={d3Container}
        viewBox={`0 0 ${w} ${h}`}
    ><g></g></svg>
  )
}

export default Map
