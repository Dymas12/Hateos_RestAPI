const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const JWTsecret = "SAODJAJDSAHDASDGASDAOISDASDÇALSDLSDLKSDD";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    jwt.verify(token, JWTsecret, (err, data) => {
      if (err) {
        res.status(401);
        res.json({ err: "Token invalido" });
      } else {
        req.token = token;
        req.loggeruser = { id: data.id, email: data.email };
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ err: "token invalido" });
  }
  console.log(authToken);
}

var DB = {
  games: [
    {
      id: 23,
      title: "Call of duty MW",
      year: 2019,
      price: 60,
    },
    {
      id: 65,
      title: "Sea of thieves",
      year: 2018,
      price: 40,
    },
    {
      id: 2,
      title: "Minecraft",
      year: 2012,
      price: 20,
    },
  ],
};
var users = [
  {
    id: 1,
    name: "Ruan Gonçalves",
    email: "ruannunes@gmail.com",
    password: "nodejs123",
  },
  {
    id: 20,
    name: "Miguel Angelo",
    email: "miguel@gmail.com",
    password: "12334",
  },
];

app.get("/games", auth, (req, res) => {
  var HATEOAS = [
    {
      href: "http://localhost:45679/game/0",
      method: "Delete",
      rel: "delete_game",
    },
    {
      href: "http://localhost:45679/game/0",
      method: "GET",
      rel: "get_game",
    },
    {
      href: "http://localhost://45679/auth",
      method: "POST",
      rel: "login",
    },
  ];
  res.statusCode = 200;
  res.json({games:DB.games, _links:HATEOAS})
});

app.get("/game/:id", (req, res) => {


    
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    var HATEOAS = [
        {
          href: "http://localhost:45679/game/" + id,
          method: "Delete",
          rel: "delete_game",
        },
        {
          href: "http://localhost:45679/game/"+id,
          method: "GET",
          rel: "get_game",
        },
        {
          href: "http://localhost://45679/auth",
          method: "POST",
          rel: "login",
        },
      ];

    var game = DB.games.find((g) => g.id == id);

    if (game != undefined) {
      res.statusCode = 200;
      res.json({game , _links:HATEOAS});
    } else {
      res.sendStatus(404);
    }
  }
});

app.post("/game", (req, res) => {
  var { title, price, year } = req.body;
  DB.games.push({
    id: 2323,
    title,
    price,
    year,
  });
  res.sendStatus(200);
});

app.delete("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    var index = DB.games.findIndex((g) => g.id == id);

    if (index == -1) {
      res.sendStatus(404);
    } else {
      DB.games.splice(index, 1);
      res.sendStatus(200);
    }
  }
});

app.put("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    var HATEOAS = [
        {
          href: "http://localhost:45679/game/0",
          method: "Delete",
          rel: "delete_game",
        },
        {
          href: "http://localhost:45679/game/"+id,
          method: "PUT",
          rel: "edit_game",
        },
        {
          href: "http://localhost://45679/games",
          method: "POST",
          rel: "get_all_games",
        },
      ];

    var game = DB.games.find((g) => g.id == id);

    if (game != undefined) {
      var { title, price, year } = req.body;

      if (title != undefined) {
        game.title = title;
      }

      if (price != undefined) {
        game.price = price;
      }

      if (year != undefined) {
        game.year = year;
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.post("/auth", (req, res) => {
  var { email, password } = req.body;
  if (email != undefined) {
    var user = users.find((u) => u.email == email);
    if (user != undefined) {
      if (user.password == password) {
        jwt.sign(
          { id: user.id, email: user.email },
          JWTsecret,
          { expiresIn: "48h" },
          (err, token) => {
            if (err) {
              res.status(400);
              res.json("Falha na hora de gerar o token");
            } else {
              res.status(200);
              res.json({ token: token });
            }
          }
        );
      } else {
        res.status(401);
        res.json("Credencial invalida");
      }
    } else {
      res.status(404);
      res.json("Email não existe");
    }
  } else {
    res.status(400);
    res.json({ err: "Email invalido" });
  }
});

app.listen(45678, () => {
  console.log("API RODANDO!");
});
