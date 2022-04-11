# Shiny Tracker

A shiny hunt counter and tracker for trainers.

![shiny tracker gif](https://raw.githubusercontent.com/anna-liang/shiny-tracker/main/client/src/media/demo.gif?token=AJJH5RCJSLXEHNI6OV6X5I3BRHTJ2)

[Try out the app here!](https://shinytracker.herokuapp.com/)

## Features
- A counter for any currently active hunt
- A hunts tab to keep track of all on-going hunts
- Each hunt keeps track of its target, hunting method, game generation, phase, and whether a shiny charm is present
- Trainers can set their custom step counter

## Installation
1. Have Docker installed
2. Build and run the app with docker-compose!
```bash
docker-compose up -d
```
3. Navigate over to http://localhost:3000/

## Usage
- Sign up as a new user or login with an existing account
- The Counter tab will display your active hunt
- The Hunts tab will display a list of all of your hunts
- To add a new hunt, simply click the New Hunt button at the stop of the Hunts tab
- From there, you can edit the information pertaining to your hunt
- Only one hunt can be set as the active hunt from the Hunts tab
