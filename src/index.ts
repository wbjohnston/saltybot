import * as dotenv from "dotenv"
import axios from "axios"
import * as Discord from "discord.js"


const POLL_MS = 3000;

function delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

async function getState(): Promise<any> {
    const response = await axios({
        method: 'GET',
        baseURL: process.env.SALTYBET_URL,
        url: `/state.json?t=${(new Date()).getTime()}`
    })

    return response.data
}


const exit = false
dotenv.config();
const client = new Discord.Client()
client.on('ready', async () => {
    console.log(`Logged in as ${client?.user?.tag}`)

    const channel = client.channels.cache.get('697617552926572571') as Discord.TextChannel
    let lastSeenP1
    let lastSeenP2

    while (!exit) {
        try {
            console.log("fetching state....")
            const state = await getState();
            const p1 = state.p1name;
            const p2 = state.p2name;
            const isDifferentMatch = p1 !== lastSeenP1 && p2 !== lastSeenP2

            // post a notification if it's a new match
            if (state.status === 'open' && isDifferentMatch) {
                channel.send(`new match is starting! ${p1} vs ${p2} https://www.saltybet.com`)
                lastSeenP1 = p1
                lastSeenP2 = p2
            }

            // TODO: post a notification when a match has been locked in
            // TODO: post all registered players bets
            // TODO: post a message when a registered player has a big win or loss

            // TODO: send a notification when there are X rounds remaining before a tournament

            // TODO: send a notification when a tournament is starting

        } catch (e) {
            console.error(e)
        }

        await delay(POLL_MS)
    }
})

client.login(process.env.DISCORD_TOKEN)