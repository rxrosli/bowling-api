# Bowling API

Backend bowling game scorer developed in a behavior driven way. Coding exercise for StrongMind/SMLP interview.

## Bowling Game

- id
- name

### Create Bowling Game

`POST /api/games/`

#### Request Parameters

```javascript
{
  "name" : string
}
```

#### Response

```javascript
{
	"data": {
			"id": string,
			"name": string
	}
}
```

### Delete Bowling Game

`DELETE /api/games/{:id}`

#### Response

`No Content`

### Read Bowling Game

`GET /api/games/{:id}`

#### Response

```javascript
{
	"data": {
			"id": string,
			"name": string
	}
}
```

### Update Bowling Game

`PUT /api/games/{:id}`

#### Request Parameters

```javascript
{
  "name" : string,
}
```

#### Response

`No Content`

### Get All Bowling Games

`GET /api/games`

#### Response

```javascript
{
	"data": {
			"id": string,
			"name": string
	}[]
}
```

## Frame Score

- id
- pins_knocked_down
- score

### Create Frame Score

`POST /api/games/{:game_id}/shots`

#### Request Parameters

```javascript
{
  "pins_knocked_down" : number[]
}
```

#### Response

`Created`

### Delete Frame Score

`DELETE /api/games/{:game_id}/shots/{:id}`

#### Response

`No Content`

### Read Frame Score

`GET /api/games/{:game_id}/shots/{:id}`

#### Response

```javascript
{
	"data":{
		"id": string,
		"pins_knocked_down" : number[],
		"score": number
	}
}
```

### Update Frame Score

`PUT /api/games/{:game_id}/shots/{:id}`

#### Request Parameters

```javascript
{
  "pins_knocked_down" : number[]
}
```

#### Response

`No Content`

### Get All Frames

`GET /api/games/{:game_id}/shots`

#### Response

```javascript
{
	"data":{
		"id": string,
		"pins_knocked_down" : number[],
		"score": number
	}[]
}
```

## Available Scripts

- `npm run start` - eun build server.
- `npm run build` - transpile TypeScript to ES6.
- `npm run test` - run all tests.
- `npm run dev` - run locally with nodemon in localhost:3000.
