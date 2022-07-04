# Bowling API

Backend bowling game scorer developed in a behavior driven way. Coding exercise for StrongMind/SMLP interview.

## Bowling Game

- id
- name

### Create Bowling Game

`POST /api/games/`

### Delete Bowling Game

`DELETE /api/games/{:id}`

### Read Bowling Game

`GET /api/games/{:id}`

### Update Bowling Game

`PUT /api/games/{:id}`
~

## Frame Score

- id
- pins_knocked_down

### Create Frame Score

`POST /api/games/{:game_id}/shots`

### Delete Frame Score

`DELETE /api/games/{:game_id}/shots/{:id}`

### Read Frame Score

`GET /api/games/{:game_id}/shots/{:id}`

### Update Frame Score

`PUT /api/games/{:game_id}/shots/{:id}`
