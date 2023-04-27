const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('index')
})

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
