import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  // Every 14 minutes
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("Keep-alive request successful");
      else
        console.error(
          `Keep-alive request failed with status code: ${res.statusCode}`
        );
    })
    .on("error", (e) => console.error(`Error during keep-alive request: ${e}`));
});

export default job;

// CRON JOB EXPLANATION
// This cron job runs every 14 minutes (*/14 * * * *) to send a GET request
// to the API_URL specified in the environment variables. This is used to keep
// the server alive and prevent it from going to sleep, which is especially
// useful for serverless environments or hosting services that may idle the app
// after a period of inactivity. The job logs the success or failure of the
// request to the console for monitoring purposes.
