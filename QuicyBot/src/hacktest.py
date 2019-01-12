#!/usr/bin/env python3

# Import the imdb package.
import imdb

# Create the object that will be used to access the IMDb's database.
ia = imdb.IMDb() # by default access the web.

# Search for a movie (get a list of Movie objects).
s_result = ia.search_movie('The Untouchables')

# Print the long imdb canonical title and movieID of the results.
# for item in s_result:
#    print(item['long imdb canonical title'], item.movieID)

# Retrieves default information for the first result (a Movie object).
the_unt = s_result[0]
ia.update(the_unt)

# Print some information.
print(the_unt['runtime'])
print(the_unt['rating'])
director = the_unt['director'] # get a list of Person objects.


# search for a person name
people = ia.search_person('Jason Momoa')
for person in people:
   print(person.personID, person['name'])



films = ia.get_person_main(people[0].personID)
print(films)
for film in films['data']['filmography'][0]['actor']:
  print(ia.search_movie(film))
