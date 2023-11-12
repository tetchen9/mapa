import React from 'react';
import Map from '.';
import { positionText } from './utils.js'

const cities = [{
    "City": "Faro",
    "Longitude": "-7.935",
    "Lattitude": "37.016",
  },
  {
    "City": "Lagos",
    "Longitude": "-8.672",
    "Lattitude": "37.12",
  },
  {
    "City": "Sagres",
    "Longitude": "-8.939",
    "Lattitude": "37",
  },
  {
    "City": "Lisboa",
    "Longitude": "-9.133",
    "Lattitude": "38.716",
  },
  {
    "City": "Sintra",
    "Longitude": "-9.388",
    "Lattitude": "38.799",
  },
]


test('calculates coordinates to position cities text', () => {
  const formatted = positionText(cities)
  expect(formatted[0].textX).toBe(-7.935)
  expect(formatted[0].textY).toBe(37.466)

  expect(formatted[1].textX).toBe(-8.672)
  expect(formatted[1].textY).toBe(37.57)

  expect(formatted[2].textX).toBe(-10.439)
  expect(formatted[2].textY).toBe(37)

  expect(formatted[3].textX).toBe(-9.133)
  expect(formatted[3].textY).toBe(38.716)

  expect(formatted[4].textX).toBe(-10.888)
  expect(formatted[4].textY).toBe(39.249)
  
});

test('calculates coordinates to position cities text simple coordinates', () => {
  const citiesSimple = [
    {
      "City": "Faro",
      "Longitude": "9",
      "Lattitude": "3",
    },
    {
      "City": "Sagres",
      "Longitude": "5",
      "Lattitude": "3",
    },
    {
      "City": "Lagos",
      "Longitude": "7",
      "Lattitude": "5",
    },
  ]

  const formatted = positionText(citiesSimple, 3)
  expect(formatted[0].textX).toBe(9)
  expect(formatted[0].textY).toBe(3)

  expect(formatted[1].textX).toBe(3.5)
  expect(formatted[1].textY).toBe(3)
  
  expect(formatted[2].textX).toBe(7)
  expect(formatted[2].textY).toBe(5.45)
  
});
