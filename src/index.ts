import * as dotenv from "dotenv"
import axios from "axios"
import * as Discord from "discord.js"
import { SaltyBet, STATUS } from './SaltyBet';


const POLL_MS = 3000;

function delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

async function getState(): Promise<any> {
    const response = await axios({
        method: 'GET',
        baseURL: process.env.SALTYBET_URL,
        url: `/state.json?t=${(new Date()).getTime()}`
    });

    return response.data;
}

let exit = false;
dotenv.config();
const client = new Discord.Client();
client.on('ready', async () => {
    const state = await getState();
    let saltyBet = new SaltyBet(state.status);

    console.log(`Logged in as ${client?.user?.tag}`);
    const channel = client.channels.cache.get('697617552926572571') as Discord.TextChannel;
    let lastSeenP1;
    let lastSeenP2;

    while (!exit) {
        try {
            console.log("fetching state....");

            const state = await getState();
            let p1 = state.p1name;
            let p2 = state.p2name;
            const isDifferentMatch = p1 != lastSeenP1 && p2 != lastSeenP2;

            console.log(state.status);
            // post a notification if it's a new match
            if (saltyBet.getStatus() === STATUS.Locked && state.status == STATUS.Open) {
                channel.send(`new match is starting! ${p1} vs ${p2} https://www.saltybet.com`);
                lastSeenP1 = p1;
                lastSeenP2 = p2;
                saltyBet.setStatus(STATUS.Open);
            }
            if (saltyBet.getStatus() === STATUS.Open && state.status === STATUS.Locked) {
                channel.send(`Betting is now locked on ${p1} vs ${p2} https://www.saltybet.com`);
                saltyBet.setStatus(STATUS.Locked);
            }

            // TODO: post a notification when a match has been locked in
            // TODO: post all registered players bets
            // TODO: post a message when a registered player has a big win or loss

            // TODO: send a notification when there are X rounds remaining before a tournament

            // TODO: send a notification when a tournament is starting

        } catch (e) {
            console.error(e);
        }

        await delay(POLL_MS);
    }
});

client.login(process.env.DISCORD_TOKEN);