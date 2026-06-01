const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/api/telegram/webhook/route.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Wrap root response processing
content = content.replace(
  /const { type, reply, data } = aiResponse;[\s\S]*?let reportMsg = reply \+ "\\n";/,
  `const aiResponses = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
    let finalReportMsg = "";

    for (const resp of aiResponses) {
      const { type, reply, data } = resp;
      debugLogs.push(\`Gemini interaction type: \${type}\`);
      let reportMsg = reply ? reply + "\\n" : "";`
);

// Wrap DATABASE_COMMAND data processing
content = content.replace(
  /const { command_action, params } = data;/,
  `const commands = Array.isArray(data) ? data : [data];
      for (const cmd of commands) {
        const { command_action, params } = cmd;`
);

// Close the DATABASE_COMMAND inner loop right after `debugLogs.push("Database command processed successfully");`?
// Wait, the if/else chain for DATABASE_COMMAND ends at:
//       }
//       debugLogs.push("Database command processed successfully");
//     }
content = content.replace(
  /      \}\n      debugLogs\.push\("Database command processed successfully"\);\n    \}/,
  `      }
      } // end for cmd of commands
      debugLogs.push("Database command processed successfully");
    }`
);

// Close the outer loop and send message
content = content.replace(
  /    debugLogs\.push\("Sending final message response to Telegram\.\.\."\);\n    await sendMessage\(chatId, reportMsg\.trim\(\)\);/,
  `      finalReportMsg += reportMsg + "\\n";
    } // end for resp of aiResponses

    debugLogs.push("Sending final message response to Telegram...");
    await sendMessage(chatId, finalReportMsg.trim());`
);

fs.writeFileSync(filePath, content);
console.log("Done");
