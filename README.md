kronoSafeHomeWork
=================

premier essai avec angularJs
12/08 - V0 - point 1 3

1 OK : A user should be able to connect to your website and to search for a French City

2 NOK : The user will choose one of the cities returned by the search

3 OK : The current weather conditions are graphically displayed in the browser.

4 NOK : A graph sum up the temperature of the several searched cities.

5 NOK : Extending and polishing the user interface

6 NOK : Adding new kinds of graphics

7 NOK : use other data (forecast10day, hourly)

8 NOK : use less instead of css

9 NOK : use google graph/Raphael.js



------------------------
Utilisation :
  - Installer node.js
  - Demarrer Node.js command prompt
  - Aller à la racine ..\VE
  - Lancer le serveur : node scripts\web-server.js
  - http://localhost:8000/app/index.html

------------------------

TODO for V1 :
	a search with "Orsay"
	http://api.wunderground.com/api/:key/geolookup/q/France/Orsay.json
	"Here is a list of closest weather stations from orsay"
	show pws station city/neighborhood(I don't take airport station)
	the user can choose max distance of these stations
	the user pick a station in the list
	http://api.wunderground.com/api/:key/conditions/q/pws:IDSTATION.json
	conditions = current weather

-------------------------
Problem :
	no results for very little city (chuelles,...)
