#!/usr/bin/env node

/**
 * Test script to run the dev agent with a predefined feature request
 * Usage: node test-agent.js "your feature request here"
 */

const { main } = require('./agent');

// Override readline to provide automated input
const Module = require('module');
const originalRequire = Module.prototype.require;

let inputQueue = [];
let inputIndex = 0;

Module.prototype.require = function(id) {
  const module = originalRequire.apply(this, arguments);
  
  if (id === 'readline') {
    const readline = module;
    const originalCreateInterface = readline.createInterface;
    
    readline.createInterface = function(options) {
      const rl = originalCreateInterface.apply(this, arguments);
      const originalQuestion = rl.question;
      
      rl.question = function(prompt, callback) {
        console.log(`\n[AGENT]: ${prompt}`);
        
        if (inputIndex < inputQueue.length) {
          const answer = inputQueue[inputIndex++];
          console.log(`[USER]: ${answer}\n`);
          callback(answer);
        } else {
          // If no more inputs, call the original to wait for user
          originalQuestion.call(this, prompt, callback);
        }
      };
      
      return rl;
    };
  }
  
  return module;
};

// Get feature request from command line argument
const featureRequest = process.argv[2] || 'Add a dark mode toggle to the application with localStorage persistence';

console.log('\n' + '='.repeat(60));
console.log('🤖 DEV AGENT TEST');
console.log('='.repeat(60));
console.log(`\nFeature Request: "${featureRequest}"\n`);

// Queue up some default responses for clarification questions
// The agent will ask up to 3 clarification questions, provide generic positive answers
inputQueue = [
  'Yes, sounds good',
  'Store it in localStorage',
  'Apply it to the entire app'
];

// Run the agent
main().catch(error => {
  console.error('\n❌ Agent encountered an error:', error.message);
  if (process.env.VERBOSE === 'true') {
    console.error(error.stack);
  }
  process.exit(1);
});
