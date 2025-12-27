const express = require("express")
const fs = require("fs")
const ini = require("ini")

const app = express()
const PORT = process.env.PORT || 3000
const FILE = "./FireTimerCloud.ini"

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, ini.stringify({
    fire: {
      lastNormal: 0,
      nextNormal: 0,
      lastLvl3: 0,
      nextLvl3: 0
    }
  }))
}

app.get("/update", (req, res) => {
  const level = req.query.level
  const time = Number(req.query.time)
  if (!time || !level) return res.send("BAD")

  const data = ini.parse(fs.readFileSync(FILE, "utf-8"))

  if (level === "normal") {
    data.fire.lastNormal = time
    data.fire.nextNormal = time + 20*60
  }
  if (level === "level3") {
    data.fire.lastLvl3 = time
    data.fire.nextLvl3 = time + 3*60*60 + 20*60
  }

  fs.writeFileSync(FILE, ini.stringify(data))
  res.send("OK")
})

app.get("/FireTimerCloud.ini", (req, res) => {
  res.sendFile(__dirname + "/FireTimerCloud.ini")
})

app.listen(PORT, () => console.log("FireTimer Cloud running"))
