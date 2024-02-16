
export const positionText = (cities, minDistance = 0.7) => {

    for (let i=0; i<cities.length; i++) {
        for (let j=i+1; j<cities.length; j++) {

          const yi = + cities[i].Lattitude
          const yj = + cities[j].Lattitude
          const xi = + cities[i].Longitude
          const xj = + cities[j].Longitude
          const yDiff = Math.abs( yi - yj )
          const xDiff = Math.abs( xi - xj )

          
          if((xDiff < minDistance && yDiff < minDistance) || 
            (yDiff < 0.5 && xDiff < minDistance + 1.5)) {
                
              cities[i].textX = xi < xj ? xi - cities[i].City.length * 0.25 : xi
              cities[j].textX = xj < xi ? xj - cities[j].City.length * 0.25 : xj
              
              cities[i].textY = yi > yj ? 0.45 + yi : yi
              cities[j].textY = yj > yi ? 0.45 + yj : yj
              
              if (cities[i].City === 'Wernigerode' ) {
                cities[i].textX = xi - cities[i].City.length * 0.27
              } else
              if (cities[i].City === 'Quedlinburg' ) {
                cities[i].textY = yi + 0.4
              } else
              if (cities[i].City === 'Meissen' ) {
                cities[i].textY = yi + 0.15
                cities[i].textX = xi - cities[i].City.length * 0.3
              } else
              if (cities[i].City === 'Bergamo' ) {
                cities[i].textY = yi - 0.05
              } 
          }
      }}
      
      return cities
}