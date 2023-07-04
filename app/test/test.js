const express = require("express");
const { Redis } = require("ioredis");
const uuid = require("uuid").v4;
const axios = require("axios");

const { redisHost,mongoHost } = require("../utils/hosts");



const mongoose = require("mongoose");
const { mongoHost } = require("../utils/hosts");



const testRouter = express.Router();

const User = require("../database/models/user");
const PublicMessage = require("../database/models/public-message");
const PvMessage = require("../database/models/pv-message");
let x23;

const redis = new Redis({ host: mongoHost, port: 6373 });


const redis = new Redis({ host: redisHost, port: 6379 });




testRouter.get("/test3", async (req, res) => {
  const a = 2 + 3;
  console.log("hiiii Alll i came last");
  res.send("hi");
});

testRouter.get("/test2", async (req, res) => {
  const users = {};
  console.time("all time");
  try {
    for (let i = 0; i < 10; i++) {
      console.log(i);
      axios
        .get("https://sokan.tech/")
        .then((result) => {
          console.log(result.status);
        })
        .catch((err) => {
          console.log("Error");
        });
      if (i === 9) {
        console.log("6+7");
        axios
          .get("https://www.tesla.com/")
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log("err");
          });
      }
    }
  } catch (err) {
    console.log("error");
  }
  console.time("Array time: ");

  for (let i = 0; i < 1000000; i++) {
    let x1 = uuid();
    let x2 = uuid();
    users[x1] = x2;
    const xx = await users[x1];
    // console.log("A: ", xx);
  }

  console.timeEnd("Array time: ");
  console.timeEnd("all time");
  res.send("hiiii");
});

testRouter.get("/testtt", async (req, res, next) => {
  const users = {};
  // await redis.flushdb();

  console.time("Redis time: ");
  // const xx = await redis.get("sdvdgeragaegaerghaex1");

  // for (let i = 100000; i < 700000; i++) {
  //   // let x1 = Math.floor(Math.random() * 1000000);
  //   let x2 = Math.floor(Math.random() * 1000);

  //   // console.log(x1);
  //   // let x1 = uuid();
  //   // let x2 = uuid();

  //   await redis.set(`${i}`, `${x2}`);
  //   // const xx = await redis.get(x1);
  //   // console.log(x1)
  //   // console.log("R: ",xx)
  // }
  console.timeEnd("Redis time: ");

  // console.log(await redis.info("memory"));

  console.time("Array time: ");
  for (let i = 0; i < 1000000; i++) {
    let x1 = uuid();
    let x2 = uuid();
    users[x1] = x2;
    const xx = await users[x1];
    // console.log("A: ", xx);
  }
  console.timeEnd("Array time: ");

  res.send("hi");
});

module.exports = { testRouter };
