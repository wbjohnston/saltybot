import * as dotenv from "dotenv"
import axios from "axios"
import * as Discord from "discord.js"
import { SaltyBet, Status } from './SaltyBet';
import { UserRepository } from "./UserRepository";


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

const exit = false;
dotenv.config();
const client = new Discord.Client();
client.on('ready', async () => {
    let currentState = await getState();
    const saltyBet = new SaltyBet(currentState.status, currentState.p1total, currentState.p2total);

    console.log(`Logged in as ${client?.user?.tag}`);
    const channel = client.channels.cache.get(process.env.DISCORD_ID as string) as Discord.TextChannel;

    while (!exit) {
        try {
            console.log("fetching state....");

            currentState = await getState();

            // post a notification if it's a new match
            if (saltyBet.getStatus() === Status.Locked && currentState.status === Status.Open) {
                channel.send(`new match is starting! ${currentState.p1name} vs ${currentState.p2name} https://www.saltybet.com`);
                saltyBet.setStatus(Status.Open);
            }
            if (saltyBet.getStatus() === Status.Open && currentState.status === Status.Locked) {
                handleLockedState(channel, saltyBet, currentState);
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

client.on('message', async (message: any) => {
    const channel = client.channels.cache.get(process.env.DISCORD_ID as string) as Discord.TextChannel;
    const commandString = message.content;
    const commandArray = commandString.split(" ");
    const command = commandArray[0];

    switch(command) {
        case 'Register':
            if (commandArray.length !== 2) {
                channel.send(`Command failed: Register, Expected: "Register <user email>"`);

                break
            }
            const userRepository = new UserRepository();
            userRepository.addUser(commandArray[1]);
            channel.send(`User ${commandArray[1]} registered`);

            break;
    }
});

function handleLockedState(channel: Discord.TextChannel, saltyBet: SaltyBet, state: any) {
    saltyBet.setPlayerOneTotalBets(parseInt(state.p1total.replace(/,/g, ''), 10));
    saltyBet.setPlayerTwoTotalBets(parseInt(state.p2total.replace(/,/g, ''), 10));

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
    const min = Math.min(playerOneTotalBets, playerTwoTotalBets);

    return `${playerOneTotalBets / min}:${playerTwoTotalBets / min}`
}

client.login(process.env.DISCORD_TOKEN);
