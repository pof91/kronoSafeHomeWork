kronoSafeHomeWork
=================

premier essai avec angularJs
- 12/08 - V0 - point 1 3
- 21/08 - V2 - point 2 5 9 10
- 24/08 - V3 - point 8 11 12
- 26/08 - V4 - point 4 6 14


  - 1 OK : A user should be able to connect to your website and to search for a French City
  - 2 OK : The user will choose one of the cities returned by the search
  - 3 OK : The current weather conditions are graphically displayed in the browser.
  - 4 OK : A graph sum up the temperature of the several searched cities.
  - 5 OK : Extending and polishing the user interface
  - 6 OK : Adding new kinds of graphics (google graph/Raphael.js)
  - 7 NOK : use other data (forecast10day, hourly)
  - 8 OK : auto-completion
  - 9 OK : Sort by name and distance
  - 10 OK : Filter by distance
  - 11 OK : create directive/services/filters
  - 12 OK : weather by geolocalisation
  - 13 NOK : use keyboard in menu
  - 14 OK : animation


------------------------
Utilisation :
  - Install node.js
  - start Node.js command prompt
  - go to rep ..\VE
  - start http server : node scripts\web-server.js
  - http://localhost:8000/app/index.html

------------------------

TODO for V1 :
  - a search with "Orsay"
  - http://api.wunderground.com/api/:key/geolookup/q/France/Orsay.json
  - "Here is a list of closest weather stations from orsay"
  - show pws station city/neighborhood(I don't take airport station)
  - the user can choose max distance of these stations
  - the user pick a station in the list
  - http://api.wunderground.com/api/:key/conditions/q/pws:IDSTATION.json
  - conditions = current weather

  ------------------------

TODO for V4 :
  - Sum up station temp
  - Use forecast and hourly with graphics

-------------------------
Problem :
	no results for very little city (chuelles,...)
