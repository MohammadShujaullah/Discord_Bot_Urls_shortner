import { REST, Routes } from 'discord.js';
import "dotenv/config";   // importing the env file

 

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;




const commands = [
  {
    name: 'create',
    description: 'Create a new short URL',
    options: [
      {
        name: 'url',
        description: 'The URL you want to shorten',
        type: 3, // STRING type in Discord API
        required: true
      }
    ]
  },
  {
    name: 'expand',
    description: 'Get the original URL from a short ID',
    options: [
      {
        name: 'shortid',
        description: 'The short ID to expand',
        type: 3, // STRING type
        required: true
      }
    ]
  },
  {
    name: 'analytics',
    description: 'Get analytics for a short URL',
    options: [
      {
        name: 'shortid',
        description: 'The short ID to get analytics for',
        type: 3, // STRING type
        required: true
      }
    ]
  },
];

const rest = new REST({ version: '10' }).setToken(token);


try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(clientId), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}