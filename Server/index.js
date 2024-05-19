const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 8087;
const fs = require("fs");
const { MessagingResponse } = require("twilio").twiml;
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "familpps_ashish",
    password: "Ashish@123",
    database: "familpps_stagecoach_patches",
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "alex_event",
});

// Function to execute database queries
const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(query, values, (err, results) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
};
// POST request for sending messages

app.post("/api/send-sms", async (req, res) => {
    const { to, from, body, id } = req.body;

    // Replace these with your Twilio credentials
    const accountSid = "AC450154e8d2737cf678f5fafab8520d6d";
    const authToken = "d46cdf2dda2555b38a9fd17fbb0d15fb";

    const client = require("twilio")(accountSid, authToken);

    client.messages
        .create({
            body: body,
            from: from,
            to: to,
        })
        .then(async (message) => {
            const query = `
          UPDATE user_data
          SET texttouser = JSON_SET(
              IFNULL(texttouser, '{"msg": "", "count": 0}'),
              '$.msg',
              ?,
              '$.count',
              IFNULL(JSON_UNQUOTE(JSON_EXTRACT(texttouser, '$.count')), 0) + 1
          )
          WHERE id = ?;
      `;
            const values = [body, id];
            const log = "Message details updated";

            await saveData(req, res, query, values, log);
            res.json({ messageSid: message.sid });
            console.log("Message sent and DB updated;");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});
// Function to handle saving data in a generic way
const saveData = async (req, res, query, values, log) => {
    try {
        console.log("Connected to the database");
        await executeQuery(query, values);
        console.log(query, values);
        console.log(log);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500); // Send an error response and return to exit the function
    }
};

// POST route to save SVG data
app.post("/api/savesvg", (req, res) => {
    const data = req.body;
    console.log(data);
    const { canvasuri, userDetails, timeDiff, itemname, customizeInfo } = data;
    const parseduserDetails = JSON.parse(userDetails);
    const parsedItemDetails = JSON.parse(itemname);
    console.log(
        "--------------------------------------------------------------------"
    );
    console.log(data);
    const filePath =
        __dirname + `/canvas/${parseduserDetails.firstName + Date.now()}.svg`;
    console.log("Data received for", parseduserDetails.firstName);
    fs.writeFile(filePath, canvasuri, async (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const respath = filePath.replace(
                "/home/familpps/public_html",
                "https://familyindustriesapps.com"
            );

            const query1 = `INSERT INTO user_data (userdetails, itemname,customizeInfo, canvasuri, usagetime, updationtime) VALUES (?, ?, ?, ?, ?,?)`;
            const values1 = [
                userDetails,
                itemname,
                customizeInfo,
                respath,
                timeDiff,
                new Date(),
            ];
            const log1 = "Data Inserted successfully !!";

            await saveData(req, res, query1, values1, log1);
            const query2 = `UPDATE inventory_list SET used_count = used_count + 1 WHERE img_name = ?`;
            const values2 = [parsedItemDetails];

            const log2 = "Inventory used count updated";
            await saveData(req, res, query2, values2, log2);

            // If there was no error, you can send the success response here
            res.status(200).send("Entry updated");
        }
    });
    console.log(
        "--------------------------------------------------------------------"
    );
});
app.post("/api/savepng", (req, res) => {
    const data = req.body;
    console.log(data);
    const { canvasuri, userDetails, timeDiff, itemname, customizeInfo } = data;
    const parseduserDetails = JSON.parse(userDetails);
    const parsedItemDetails = JSON.parse(itemname);
    const parsedCustomizeInfo = JSON.parse(customizeInfo);
    const base64Data = canvasuri.replace(/^data:image\/png;base64,/, "");
    console.log(
        "--------------------------------------------------------------------"
    );
    console.log(data);
    const filePath =
        __dirname + `/canvas/${parseduserDetails.firstName + Date.now()}.png`;
    console.log("Data received for", parseduserDetails.firstName);
    fs.writeFile(filePath, base64Data, "base64", async (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const respath = filePath.replace(
                "/home/familpps/public_html",
                "https://familyindustriesapps.com"
            );

            const query1 = `INSERT INTO user_data (userdetails, itemname,customizeInfo, canvasuri, usagetime, updationtime) VALUES (?, ?, ?, ?, ?,?)`;
            const values1 = [
                userDetails,
                itemname,
                customizeInfo,
                respath,
                timeDiff,
                new Date(),
            ];
            const log1 = "Data Inserted successfully !!";

            await saveData(req, res, query1, values1, log1);

            const query2 = `UPDATE inventory_list SET used_count = used_count + 1 WHERE img_name = ?`;
            const values2 = [parsedItemDetails];
            const log2 = "Inventory used count updated";
            await saveData(req, res, query2, values2, log2);

            const query3 = `UPDATE border_list SET used_count = used_count + 1 WHERE item_name = ? AND border_name = ?`;
            const values3 = [
                parsedItemDetails.slice(0, -1),
                parsedCustomizeInfo.text.border,
            ];
            const log3 = "Inventory Border used count updated";
            await saveData(req, res, query3, values3, log3);

            // If there was no error, you can send the success response here
            res.status(200).send("Entry updated");
        }
    });
    console.log(
        "--------------------------------------------------------------------"
    );
});

// POST route to save SVG data
app.post("/api/savetext", async (req, res) => {
    const data = req.body;
    console.log(data);
    const { userDetails, timeDiff, itemname, customizeInfo } = data;
    const parseduserDetails = JSON.parse(userDetails);
    const parsedItemDetails = JSON.parse(itemname);
    console.log(
        "--------------------------------------------------------------------"
    );
    console.log(data);

    console.log("Data received for", parseduserDetails.firstName);
    const query1 = `INSERT INTO user_data (userdetails, itemname,customizeInfo, usagetime, updationtime) VALUES (?, ?, ?, ?,?)`;
    const values1 = [
        userDetails,
        itemname,
        customizeInfo,
        timeDiff,
        new Date(),
    ];
    const log1 = "Text Data Inserted successfully !!";

    await saveData(req, res, query1, values1, log1);
    const query2 = `UPDATE inventory_list SET used_count = used_count + 1 WHERE img_name = ?`;
    const values2 = [parsedItemDetails];

    const log2 = "Inventory used count updated";
    await saveData(req, res, query2, values2, log2);

    // If there was no error, you can send the success response here
    res.status(200).send("Entry updated");
    console.log(
        "--------------------------------------------------------------------"
    );
});

// GET route to fetch data
app.get("/api/fetchdb", async (req, res) => {
    try {
        const query = `SELECT * FROM user_data`;
        const result = await executeQuery(query, []);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// POST route to save dds response
app.post("/api/savestatus", async (req, res) => {
    try {
        const data = req.body;
        const { type, status, id } = data;
        // type has two values status and status_text = sms text
        const query = `UPDATE user_data SET ${type} = ? WHERE id = ?`;
        const values = [status, id];
        console.log("Savestatus API - saving data", data);
        await executeQuery(query, values);
        res.send("Status updated");
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
// GET route to fetch inventory data
app.get("/api/fetchinventory", async (req, res) => {
    try {
        const query = "SELECT * FROM inventory_list";
        const result = await executeQuery(query, []);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get("/api/fetchborderinventory", async (req, res) => {
    try {
        const query = "SELECT * FROM border_list";
        const result = await executeQuery(query, []);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post("/api/updateborderinventory", async (req, res) => {
    try {
        const data = req.body;
        const { avlitems, ib } = data;
        // type has two values status and status_text = sms text
        const query = `UPDATE border_list SET available_items = ? WHERE ib = ?`;
        const values = [avlitems, ib];
        console.log(
            "updateborderinventory API - Updating Border Inventory",
            data
        );
        await executeQuery(query, values);
        res.send("Status updated");
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
app.post("/api/updateinventory", async (req, res) => {
    try {
        const data = req.body;
        const { avlitems, iv } = data;
        // type has two values status and status_text = sms text
        const query = `UPDATE inventory_list SET available_items = ? WHERE iv = ?`;
        const values = [avlitems, iv];
        console.log("updateinventory API - Updating Inventory", data);
        await executeQuery(query, values);
        res.send("Status updated");
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
app.get("/api/fetchGraphic", async (req, res) => {
    try {
        const query = "SELECT * FROM graphic_list";
        const result = await executeQuery(query, []);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get("/", (req, res) => {
    res.send("Hey, it's Stanley Sophia");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
