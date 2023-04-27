const express = require('express')
const app = express()
const signupRouter = require("./routes/signup")
const bodyParser = require('body-parser');
const { default: axios } = require('axios');
const request = require('request');


// const playerName = 'DyrachYO';
// const apiUrl = `https://liquipedia.net/dota2/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=${playerName}`;

// const options = {
//   url: apiUrl,
//   headers: {
//     'Accept-Encoding': 'gzip',
//   },
//   gzip: true,
// };

// request(options, (error, response, body) => {
//     if (error) {
//         console.log(`Error: ${error}`);
//         return;
//     }

//     if (response.headers['content-encoding'] === 'gzip') {
//       const data = JSON.parse(body);
//       const pages = data.query.pages;
//       const player = pages[Object.keys(pages)[0]];

//       const wikitext = player.revisions[0]['*'];
//       const imageMatch = wikitext.match(/\|\s*image\s*=\s*(.*)/);

//       if (imageMatch && imageMatch[1]) {
//         let imageName = imageMatch[1];
//         imageName = imageName.replace(/\s+/g, '_');
//         console.log(`Player image name: ${imageName}`);
//         setTimeout(() => {
//           const imageApiUrl = `https://liquipedia.net/commons/api.php?action=query&format=json&prop=imageinfo&titles=File:${imageName}&iiprop=url`;
//           request({ url: imageApiUrl, gzip: true }, (error, response, body) => {
//             if (error) {
//               console.log(`Error: ${error}`);
//               return;
//             }

//             const data = JSON.parse(body);
//             const pages = data.query.pages;
//             const imageInfo = pages[Object.keys(pages)[0]].imageinfo[0];
//             const imageUrl = imageInfo.url;
//             console.log(`Player image URL: ${imageUrl}`);
//             // Do something with the image URL
//           });
//         }, 3000);
//       } else {
//         console.log(`No image found for player ${playerName}`);
//       }
//     } else {
//       console.log(`Error: Server did not return a gzip-encoded response`);
//     }
// });



const mongoose = require('mongoose')
const db = mongoose.connection
// mongoose.connect('mongodb://localhost:4000')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://qewaru:17aezakmi@cluster0.9ohhtra.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
    try {
        await mongoose.connect(uri)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}
connect()

app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('index')
})

app.post("/signup", (req, res) => {
    var login = req.body.login
    var password = req.body.password
    var username = req.body.username
    console.log(login, password, username)

    var userData = {
        "login": login,
        "password": password,
        "username": username
    }

    db.collection("usersData").insertOne(userData, (error, collection) => {
        if(error) {
            throw error
        }
        console.log("Userdata saved")
    })
    res.render('index')
})

app.get("/signin", (req, res) => {
    var login = req.query.inlogin
    var password = req.query.inpassword
    // console.log(login, password)

    db.collection("usersData").findOne({ "login": login }, (err, user) => {
        if (err) {
            throw err
        }
        if (user) {
            console.log("login correct")
            if (user.password === password) {
                console.log("password correct")
                res.render('index')
            } else {
                console.log("password incorrect")
                res.render('index')
            }
        } else {
            console.log("doesn't exist")
            res.render('index')
        }
    })
})

app.get("/teams", async function (req, res) {
    try {
        const response = await axios.get(`https://api.opendota.com/api/teams`)
        const teamsData = response.data
        let teamArray = []
        teamsData.forEach(team => {
            let teamNickname = team.name
            teamArray.push({name: teamNickname})
        })
        res.render('teams', { teamArray })
    } catch (error) {
        console.log(error)
        res.render('teams', { teamsData: [] })
    }
})
//<span><%= JSON.stringify(teamArray) %></span>
app.get("/proteam", async function (req, res) {
    const teamName = req.query.proteam.toLowerCase()

    try {
        const response = await axios.get(`https://api.opendota.com/api/teams`)
        const teamsData = response.data
        let teamNickname
        let teamFound = false
        teamsData.forEach(team => {
            if (teamName === team.name.toLowerCase()) {
                teamFound = true
                teamNickname = team.name
            }
        })
        if (teamFound) {
            teamNickname.replace(/\s+/g, '')
            res.redirect(`/proteam/${teamNickname}`);
        } else {
            res.render('notfound')
        }
    } catch (error) {
        console.log(error)
        
    }
})

app.get("/proteam/:teamNickname", async function (req, res) {
    const teamName = req.params.teamNickname
    try {
        const response = await axios.get(`https://api.opendota.com/api/teams`)
        const teamData = response.data
        let teamArray
        teamData.forEach(team => {
            if (teamName === team.name) {
                teamArray = {
                    id: team.team_id,
                    name: team.name,
                    tag: team.tag,
                    wins: team.wins,
                    loses: team.loses,
                    rating: team.rating
                }
                if (team.loses === undefined) {
                    teamArray.loses = "no data"
                }
            }
            
        })
        console.log(teamArray)
        if (teamArray) {
            console.log(teamArray)
            res.render('teams', { teamArray, teamData })
        }
        
    } catch (error) {
        console.log(error)
        res.render('teams', { teamData: [] })
    }
})

app.get("/proplayers", async function (req, res) {
    const playerName = req.query.proname.toLowerCase()

    try {
        const response = await axios.get(`https://api.opendota.com/api/proPlayers`)
        const playerData = response.data
        let playerNickname
        let playerFound = false
        playerData.forEach(player => {
            if (playerName === player.name.toLowerCase()) {
                playerFound = true
                playerNickname = player.name
                if (playerNickname) {
                    res.redirect(`/proplayers/${playerNickname}`);
                } else {
                    res.render('proplayer', { playerData: [] })
                }
            }
        })
        if (!playerFound) {
            res.render('notfound')
        }
    } catch (error) {
        console.log(error)
        res.render('proplayer', { playerData: [] })
    }
})

app.get("/proplayers/:playerNickname", async function (req, res) {
    const playerNickname = req.params.playerNickname
    const apiUrl = `https://liquipedia.net/dota2/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=${playerNickname}`;
    const options = {
        headers: {
          'Accept-Encoding': 'gzip',
        },
        gzip: true,
    };

    try {
        const response = await axios.get(`https://api.opendota.com/api/proPlayers`)
        const playerData = response.data
        let playerArray = {}

        playerData.forEach(player => {
            if (playerNickname === player.name) {
                playerArray = {
                    id: player.account_id,
                    name: player.name,
                    team_name: player.team_name,
                    team_tag: player.team_tag,
                    role: player.fantasy_role,
                    profile_url: player.profileurl,
                    steamname: player.personaname
                }
            }
        })

        // ...CURRENTLY NOT WORKING...

        // const resp = await axios.get(`${apiUrl}`)
        // if (resp.headers['content-encoding'] === 'gzip') {
        //     const data = resp.data
        //     const pages = data.query.pages;
        //     const player = pages[Object.keys(pages)[0]];
      
        //     const wikitext = player.revisions[0]['*'];
        //     const imageMatch = wikitext.match(/\|\s*image\s*=\s*(.*)/);
      
        //     if (imageMatch && imageMatch[1]) {
        //         let imageName = imageMatch[1];
        //         imageName = imageName.replace(/\s+/g, '_');
        //         setTimeout(() => {
        //             const imageApiUrl = `https://liquipedia.net/commons/api.php?action=query&format=json&prop=imageinfo&titles=File:${imageName}&iiprop=url`;
        //             axios.get(imageApiUrl).then((response) => {
        //                 const data = response.data
        //                 const pages = data.query.pages;
        //                 const imageInfo = pages[Object.keys(pages)[0]].imageinfo[0];
        //                 const imageUrl = imageInfo.url;
        //                 // playerArray.image = imageUrl
        //             })
        //         }, 3000);
        //     } else {
        //       console.log(`No image found for player ${playerName}`);
        //     }
        // } else {
        //     console.log(`Server did not return a gzip-encoded response`);
        //     const data = resp.data
        //     const pages = data.query.pages;
        //     const player = pages[Object.keys(pages)[0]];
      
        //     const wikitext = player.revisions[0]['*'];
        //     const imageMatch = wikitext.match(/\|\s*image\s*=\s*(.*)/);
      
        //     if (imageMatch && imageMatch[1]) {
        //         let imageName = imageMatch[1];
        //         imageName = imageName.replace(/\s+/g, '_');
        //         setTimeout(() => {
        //             const imageApiUrl = `https://liquipedia.net/commons/api.php?action=query&format=json&prop=imageinfo&titles=File:${imageName}&iiprop=url`;
        //             axios.get(imageApiUrl).then((response) => {
        //                 const data = response.data
        //                 const pages = data.query.pages;
        //                 const imageInfo = pages[Object.keys(pages)[0]].imageinfo[0];
        //                 const imageUrl = imageInfo.url;
        //                 playerArray.image = imageUrl
        //                 res.render('proplayer', { playerArray, playerData })
        //             })
        //         }, 3000);
        //     } else {
        //       console.log(`No image found for player ${playerName}`);
        //     }
        // }
        res.render('proplayer', { playerArray, playerData })
    } catch (error) {
        console.log(error)
        res.render('proplayer', { playerData: [] })
    }
})

app.get("/matches/:match_id", async function (req, res) {
    const match_id = req.params.match_id

    function formatDuration(durationInSeconds) {
        const minutes = Math.floor(durationInSeconds / 60)
        const seconds = durationInSeconds % 60;
        const formSecond = seconds < 10 ? `0${seconds}` : seconds
        return `${minutes}:${formSecond}`
    }

    axios.get(`https://api.opendota.com/api/matches/${match_id}`)
        .then(async response => {
            const matchData = response.data

            const heroData = await axios.get('https://api.opendota.com/api/heroes')
            const heroStats = await axios.get('https://api.opendota.com/api/heroStats')
            const heroes = {}
            const heroesIcon = {}

            heroData.data.forEach(hero => {
              heroes[hero.id] = hero.localized_name
            })
            
            heroStats.data.forEach(hero => {
                heroesIcon[hero.id] = hero.icon
            })

            matchData.picks_bans.forEach(pickBan => {
              const isPick = pickBan.is_pick
              const heroId = pickBan.hero_id
              const heroName = heroes[heroId]
              const heroIcon = heroesIcon[heroId]
              pickBan.hero_name = heroName
              pickBan.hero_icon = heroIcon
              pickBan.action_type = isPick ? 'picked' : 'banned'
            })

            matchData.players.forEach(player => {
                let playernick = player.personaname
                if (playernick === undefined) {
                    player.personaname = null
                }
            })
            const matchDuration = formatDuration(matchData.duration)
            res.render('result', { matchData, formatDuration: formatDuration, heroes: heroes, heroesIcon : heroesIcon})
        })
        .catch(error => {
            console.log(error)
            res.status(500).send("Error fetching.")
        })
})

const port = 4000
app.listen(process.env.PORT || port, () => {
    console.log('Server started on port 4000')
})

// opendota api key - 6c3fd62e-92cf-4eb1-88f8-bdcd039eab5a
// match id - 7099402332

// <% matchData.picks_bans.map(hero => { %>
//     <p><%= hero.hero_name %></p>
// <% }); %>

//<pre><%= JSON.stringify(matchData, null, 2) %></pre> 
// <pre style="color: black"><%= JSON.stringify(matchData.players) %></pre>

// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
//   async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect();
//       // Send a ping to confirm a successful connection
//       await client.db("admin").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
//   run().catch(console.dir);