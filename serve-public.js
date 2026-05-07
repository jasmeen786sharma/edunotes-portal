const { spawn } = require('child_process');

console.log("🚀 Building Frontend...");
const build = spawn('npm', ['run', 'build'], { cwd: './frontend', stdio: 'inherit', shell: true });

build.on('close', (code) => {
  if (code !== 0) {
    console.error(`Build process exited with code ${code}`);
    return;
  }
  
  console.log("✅ Frontend Built Successfully!");
  console.log("🚀 Starting Unified Server on port 5000...");
  
  const backend = spawn('node', ['server.js'], { cwd: './backend', stdio: 'inherit', shell: true });

  console.log("🌐 Starting stable Localtunnel...");
  const lt = spawn('npx', ['-y', 'localtunnel', '--port', '5000'], { shell: true });
  
  lt.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output.includes("your url is:")) {
      const url = output.split("your url is: ")[1];
      console.log("\n=======================================================");
      console.log("🎉 YOUR PERMANENT PUBLIC LINK IS ACTIVE!");
      console.log("👉 " + url);
      console.log("=======================================================\n");
      console.log("⚠️ DO NOT CLOSE THIS TERMINAL to keep the site live.");
    } else {
      console.log(output);
    }
  });

  lt.stderr.on('data', (data) => console.error(`Localtunnel Error: ${data}`));
});
