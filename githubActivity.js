#!/usr/bin/env node

import axios from "axios";
import { Command } from "commander";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const program = new Command();
const GITHUB_API_URL = "https://api.github.com";

// Function to fetch GitHub user activity
async function fetchGitHubActivity(username) {
    try {
        let headers = {};
        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await axios.get(`${GITHUB_API_URL}/users/${username}/events/public`, { headers });

        if (response.status !== 200) {
            console.log(chalk.red(`❌ Error: Unable to fetch data (Status Code ${response.status})`));
            return;
        }

        const events = response.data;

        if (events.length === 0) {
            console.log(chalk.yellow(`⚠️ No recent public activity found for ${username}.`));
            return;
        }

        console.log(chalk.green(`\n📌 Recent GitHub activity for user: ${chalk.bold(username)}`));
        console.log(chalk.blue("-".repeat(50)));

        events.slice(0, 5).forEach(event => {
            const eventType = event.type || "Unknown Event";
            const repoName = event.repo?.name || "Unknown Repo";
            const createdAt = new Date(event.created_at).toLocaleString();

            console.log(`${chalk.cyan("📍 " + eventType)} in ${chalk.magenta(repoName)} at ${chalk.yellow(createdAt)}`);
        });

        console.log(chalk.blue("-".repeat(50)));

    } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
    }
}

// Set up CLI commands
program
    .name("github-activity-cli")
    .description("Fetch recent GitHub activity of a user")
    .version("1.0.0")
    .argument("<username>", "GitHub username")
    .action(fetchGitHubActivity);
program.parse(process.argv);
