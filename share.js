const { spawn } = require('child_process');

console.log("🚀 Starting Backend Server on port 5000...");
const backend = spawn('npm', ['start'], { cwd: './backend', stdio: 'inherit', shell: true });

console.log("🚀 Starting Frontend Server on port 3000...");
const frontend = spawn('npm', ['start'], { cwd: './frontend', stdio: 'inherit', shell: true });

console.log("⏳ Waiting for servers to initialize (15 seconds)...");
setTimeout(() => {
  console.log("\n🌐 Generating Public Link via Localtunnel...");
  const lt = spawn('npx', ['-y', 'localtunnel', '--port', '3000'], { shell: true });
  
  lt.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output.includes("your url is:")) {
      const url = output.split("your url is: ")[1];
      console.log("\n=======================================================");
      console.log("🎉 YOUR SHAREABLE PUBLIC LINK IS READY!");
      console.log("👉 " + url);
      console.log("=======================================================\n");
      console.log("⚠️ Keep this terminal window OPEN to keep the link active!");
      console.log("If the link stops working, just close this terminal and run `node share.js` again.\n");
    } else {
      console.log(output);
    }
  });

  lt.stderr.on('data', (data) => console.error(`Localtunnel Error: ${data}`));
}, 15000);
