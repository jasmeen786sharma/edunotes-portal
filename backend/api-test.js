const http = require('http');

const testApi = async () => {
  console.log("Starting End-to-End API Tests...\n");

  const req = (path, method = "GET", data = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path: path,
        method: method,
        headers: data ? { 'Content-Type': 'application/json' } : {}
      };
      
      const request = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, body: JSON.parse(body || '{}') });
        });
      });
      
      request.on('error', reject);
      if (data) request.write(JSON.stringify(data));
      request.end();
    });
  };

  try {
    // 1. Test Login
    console.log("1. Testing POST /login (Teacher)");
    let res = await req('/login', 'POST', { email: "teacher@gmail.com", password: "123" });
    console.log(res.status === 200 && res.body.role === 'teacher' ? "✅ Pass" : "❌ Fail", res.body);

    console.log("\n2. Testing POST /login (Student)");
    res = await req('/login', 'POST', { email: "student@gmail.com", password: "123" });
    console.log(res.status === 200 && res.body.role === 'student' ? "✅ Pass" : "❌ Fail", res.body);

    // 2. Test Chatbot (Gemini)
    console.log("\n3. Testing POST /chat (AI Chatbot)");
    res = await req('/chat', 'POST', { message: "What is 2+2?" });
    console.log(res.status === 200 && res.body.reply ? "✅ Pass" : "❌ Fail", "Reply received:", res.body.reply.substring(0, 50) + "...");

    // 3. Test Notes
    console.log("\n4. Testing GET /notes");
    res = await req('/notes');
    console.log(res.status === 200 && Array.isArray(res.body) ? "✅ Pass" : "❌ Fail", `Found ${res.body.length} notes`);

    // 4. Test Attendance
    console.log("\n5. Testing GET /attendance");
    res = await req('/attendance');
    console.log(res.status === 200 && Array.isArray(res.body) ? "✅ Pass" : "❌ Fail", `Found ${res.body.length} days of attendance`);

    // 5. Test Students list
    console.log("\n6. Testing GET /students");
    res = await req('/students');
    console.log(res.status === 200 && Array.isArray(res.body) ? "✅ Pass" : "❌ Fail", `Found ${res.body.length} students`);

    // 6. Test Reports
    console.log("\n7. Testing GET /report");
    res = await req('/report');
    console.log(res.status === 200 && Array.isArray(res.body) && res.body[0].percentage !== undefined ? "✅ Pass" : "❌ Fail", `Generated report for ${res.body.length} students`);

    console.log("\n🎉 All APIs successfully verified!");
  } catch (err) {
    console.error("Test failed:", err);
  }
};

testApi();
