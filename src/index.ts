import * as dotenv from "dotenv"
import axios from "axios"
import * as Discord from "discord.js"
import { SaltyBet, Status } from './SaltyBet';


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
    let saltyBet = new SaltyBet(state.status, state.p1total, state.p2total);

    console.log(`Logged in as ${client?.user?.tag}`);
    const channel = client.channels.cache.get('697617552926572571') as Discord.TextChannel;

    while (!exit) {
        try {
            console.log("fetching state....");

            const state = await getState();

            console.log(state);
            // post a notification if it's a new match
            if (saltyBet.getStatus() === Status.Locked && state.status == Status.Open) {
                channel.send(`new match is starting! ${state.p1name} vs ${state.p2name} https://www.saltybet.com`);
                saltyBet.setStatus(Status.Open);
            }
            if (saltyBet.getStatus() === Status.Open && state.status === Status.Locked) {
                handleLockedState(channel, saltyBet, state);
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

function handleLockedState(channel: Discord.TextChannel, saltyBet: SaltyBet, state: any) {
    saltyBet.setPlayerOneTotalBets(parseInt(state.p1total.replace(/,/g, '')));
    saltyBet.setPlayerTwoTotalBets(parseInt(state.p2total.replace(/,/g, '')));

    const odds = getOdds(saltyBet.getPlayerOneTotalBets(), saltyBet.getPlayerTwoTotalBets());
    channel.send(`
        Betting is now locked on 
        ${state.p1name}: ${saltyBet.getPlayerOneTotalBets()} vs 
        ${state.p2name}: ${saltyBet.getPlayerTwoTotalBets()}. 
        Odds: ${odds}
    `);
    saltyBet.setStatus(Status.Locked);
}

function getOdds(playerOneTotalBets: number, playerTwoTotalBets: number): string {
    let odds = '1:1';

    if (playerOneTotalBets > playerTwoTotalBets) {
        let ratio = playerOneTotalBets / playerTwoTotalBets;
        ratio = Math.round(ratio * 10) / 10;

        odds = `${ratio}:1`;
    }
    if (playerTwoTotalBets > playerOneTotalBets) {
        let ratio = playerTwoTotalBets / playerOneTotalBets;
        ratio = Math.round(ratio * 10) / 10;

        odds = `1:${ratio}`;
    }

    return odds;
}

client.login(process.env.DISCORD_TOKEN);