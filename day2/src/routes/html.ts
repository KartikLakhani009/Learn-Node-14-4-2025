import { Router } from "express";
import users from "../../MOCK_DATA.json";

const htmlRouter = Router();

htmlRouter.get("/users", (req, res) => {
    const html = `
   <ul>
       ${users
            .map(
                (user) => `
           <li key=${user.id}>
               <a href="/users/${user.id}">${user.first_name} ${user.last_name}</a> ${user.email}
           </li>
       `
            )
            .join("")}
   </ul>
   `;
    res.send(html);
});

htmlRouter.get("/users/:id", (req,res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find((user) => user.id === userId);
    if(user) {
        const html = `<div style={{text-align: "center",padding: "20px"}}>
        <h1>${user.first_name} ${user.last_name}</h1>
        <h3>${user.email}</h3>
        <p>${user.gender}</p>
        </div>`
        res.send(html);
    } else {
        res.status(404).send("User not found");
    }
});
export default htmlRouter;
