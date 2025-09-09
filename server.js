const express = require('express');
const path = require('path');
const { processStudentDataWithCallbacks } = require('./modules/1_callback_logic');
const { processStudentDataWithPromises } = require('./modules/2_promise_logic');
const { processStudentDataWithAsyncAwait } = require('./modules/3_async_await_logic');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to run all demonstrations
app.get('/run', async (req, res) => {
  const results = {};

  // 1. Run Callback version
  await new Promise(resolve => {
    processStudentDataWithCallbacks((err, message) => {
      results.callback = err ? { status: 'Error', message: err } : { status: 'Success ✅', message: message };
      resolve();
    });
  });

  // 2. Run Promise version
  try {
    const promiseMessage = await processStudentDataWithPromises();
    results.promise = { status: 'Success ✅', message: promiseMessage };
  } catch (error) {
    results.promise = { status: 'Error', message: error.message };
  }

  // 3. Run Async/Await version
  try {
    const asyncAwaitMessage = await processStudentDataWithAsyncAwait();
    results.asyncAwait = { status: 'Success ✅', message: asyncAwaitMessage };
  } catch (error) {
    results.asyncAwait = { status: 'Error', message: error.message };
  }

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});