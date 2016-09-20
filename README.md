# reorganizer-js
reorganize element grid in columns

# setup

easy config.

``` 
wrapper:                  is the element that contains
containerMatch: 	      is the element where to look for the item to be matched
elementMatch: 	          is single element match
destination:              is the element to append

classColumn: 	          is a class fo a new column
extraElementClass:        is a new class to add elementMatch

foundation:               if there is foundation js
printExtraElementClass:   whether to print the extraElementClass
```

# example

containerMatch, setted in config, must have these class to initialize the plugin

``` 
"reorganize" is a class for init a plugin
"columns-4" to set the number of columns that we want  // columns-2 or colums-3 exc.. //
``` 

``` html
<div class="reorganize columns-4"></div>
``` 

elementMatch, setted in config, must have these class to append in new columns

``` html
  <div class="col-3">Pippo</div>
  <div class="col-2">Paperino</div>
  <div class="col-1">Pluto</div>
  <div class="col-2">Minnie</div>
  <div class="col-4">Zio Paperone</div>
``` 

the complete sturcture must be

``` html
<div class="reorganize columns-4">

  <div class="col-3">Pippo</div>
  <div class="col-2">Paperino</div>
  <div class="col-1">Pluto</div>
  <div class="col-2">Minnie</div>
  <div class="col-4">Zio Paperone</div>

</div>
``` 
