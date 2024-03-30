const express = require("express");
let user = require("./MOCK_DATA.json");
const fs = require("fs")
let recycle = require("./Recycle.json")

const app = express();
const cors = require("cors");
app.use(cors());

// plugin 
app.use(express.urlencoded({ extended: false }))
// middelWare
app.use(express.json());

const port = 3001;

app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);

app.get("/api/user", (req, res) => {
  return res.json(user);
});

app.get("/users", (req, res) => {
  const html = `
      <ul>
       ${user.map((user) => `<li> ${user.first_name}</li>`).join("")}
      </ul>
     `;
  res.send(html);
});

app.get("/api/user/:id", (req, res) => {
  const id = req.params.id;
  const foundUser = user.find((data) => data.id === parseInt(id) || data.first_name.toLowerCase() === id.toLowerCase() || data.department.toLowerCase() === id.toLowerCase());

  if (foundUser) {
    return res.json(foundUser);
  } else {
    return res.status(404).json({ error: "User not found" });
  }
})

app.delete("/api/user/:id", (req, res) => {
  const id = req.params.id;

  // Use the user array that you've declared
  const recycleData = user.filter((data) => data.id === Number(id));

  fs.writeFile("./Recycle.json", JSON.stringify(recycle.concat(recycleData)), (error, data) => {
    if (!error) {
      return res.json({ status: "Successfully store in recyclebin data" });
    } else {
      console.log("Error occurs", error);
      res.status(500).json({ status: "Error deleting data" });
    }
  });
  const filteredUsers = user.filter(data => data.id !== Number(id) && data.first_name.toLowerCase() !== id.toLowerCase());
  console.log(filteredUsers);


  fs.writeFile("./MOCK_DATA.json", JSON.stringify(filteredUsers), (error, data) => {
    if (!error) {
      return res.json({ status: "Successfully deleted data" });
    } else {
      console.log("Error occurs", error);
      res.status(500).json({ status: "Error deleting data" });
    }
  });
});
app.post("/api/user", (req, res) => {
  const body = req.body;
  console.log({ ...body, id: user.length + 1 })
  console.log("Received POST request to /api/user");

  user.push({ ...body, id: user.length + 1 })
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (error, data) => {
    if (error) throw console.log(error)
    return res.json({ status: "suscessfully" });

  })

});



app.get("/api/user/age/:age", (req, res) => {
  const age = parseInt(req.params.age);
  const userAge = user.filter(((data) => data.age >= age))

  if (userAge) {
    return res.json(userAge)
  }
  else {
    return res.status("404").json({ error: "here your query is not  valid " })
  }

})


app.get("/api/user/dep/:ids", (req, res) => {
  const dep = String(req.params.ids.split(",").map((val) => val.trim().toLowerCase()))
  console.log(dep);

  const userDep = user.filter((data) => dep.includes(data.department.toLowerCase()));

  if (userDep.length > 0) {
    console.log("sucussfully transfer");
    return res.json(userDep);

  } else {
    return res.status(404).json({ error: "Not valid query" });
  }
});


app.get("/api/user/salary/:ids", (req, res) => {

  const sal = req.params.ids;
  const salary = user.filter((data) => data.salary < sal);


  return res.json(salary)
})

app.put("api/user/:id", (req, res) => {

  return res.sned("Put method")
})

// show deleted data
app.get("/recycle", (req, res) => {
  return res.json(recycle)
})
// here add deleted data 
app.delete("/recycle/:ids", (req, res) => {
  const id = Number(req.params.ids);

  try {
    let reviveData;

    if (recycle.length > 0) {
      reviveData = recycle.filter(data => data.id === id);
      recycle = recycle.filter(data => data.id !== id);
    } else {
      reviveData = [{}];
    }

    if (reviveData.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    fs.writeFile("./Recycle.json", JSON.stringify(recycle), (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      user.push(...reviveData);
      user.sort((a, b) => a.id - b.id);

      fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.json({ status: "successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// user update data 
app.put("/api/user/:id", (req, res)=>{
   const id = req.params.id;
   const updatedData= req.body; 

   const userIndex= user.findIndex(data=> data.id===Number(id) || id.toLowerCase() === data.first_name.toLowerCase());
    console.log(userIndex);
    if(userIndex === -1){
       return res.json({"error":"data is not found"});

    }
    user[userIndex]= {...user[userIndex],  ...updatedData};

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.json({ status: "successfully" });
    });


    
  return res.json({status:`padding udation on perticuler ${id}  `})

})






