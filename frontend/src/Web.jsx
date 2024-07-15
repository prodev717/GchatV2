import { useSearchParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { ws } from "./Constants";
import { useState } from "react";
import { Box,Container,List,ListItem,ListItemAvatar,ListItemText,Avatar,Typography,TextField,Button,Paper,Divider } from "@mui/material";

function Web() {
    const [searchParams, setSearchParams] = useSearchParams();
    const aud = new Audio("notification.wav");
    const [chats, setChats] = useState({});
    const parms = {
        user_id: searchParams.get("user_id"),
        gender: searchParams.get("gender"),
        age: searchParams.get("age"),
        about: searchParams.get("about")
    };
    const [users, setUsers] = useState({});
    const [to, setTo] = useState("");
    const [message, setMessage] = useState("");

    function updateChat(key, value) {
        let upval = chats[key] || [];
        let cht = { ...chats };
        cht[key] = [...upval, value];
        setChats(cht);
    }

    const { sendJsonMessage } = useWebSocket(ws + "/connect", {
        share: true,
        queryParams: parms,
        onOpen: () => { console.log("connected to server") },
        onMessage: (msg) => {
            let a = JSON.parse(msg.data);
            if (a.from === "server") {
                let usr = a.users;
                Object.keys(usr).forEach(i => {
                    usr[i] = { ...usr[i], unreads: 0 };
                });
                setUsers(usr);
            } else {
                if (to !== a.from) { users[a.from].unreads += 1; }
                updateChat(a.from, `${a.from}:${a.message}`);
            }
            aud.play();
        }
    });

    function send() {
        sendJsonMessage({ from: parms.user_id, to: to, message: message });
        updateChat(to, `${parms.user_id}:${message}`);
        setMessage("");
    }

    return (
        <Container maxWidth="lg" sx={{ display: 'flex', height: '100vh', padding: 0 }}>
            <Paper elevation={3} sx={{ width: '25%', height: '100%', overflowY: 'auto' }}>
                <List>
                    <ListItem>
                        <Typography variant="h5" component="div">
                            Welcome, {parms.user_id}<br/>
                            no of users {Object.keys(users).length}
                        </Typography>
                    </ListItem>
                    <Divider />
                    {Object.keys(users).map((i) => (
                        <ListItem button key={i} onClick={() => { setTo(i); users[i].unreads = 0; }}>
                            <ListItemAvatar>
                                <Avatar>
                                    {users[i].gender === 'male' ? '👨' : '👩'}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={i}
                                secondary={`${users[i].age}, ${users[i].about}`}
                            />
                            {users[i].unreads > 0 && <Typography color="secondary">{users[i].unreads}</Typography>}
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                    {to in chats ? chats[to].map((i, index) => <Typography align={i.split(":")[0]==to?"left":"right"} key={index}>{i.split(":")[1]}</Typography>) : <Typography>No messages</Typography>}
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: 2 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        fullWidth
                        autoComplete="off"
                    />
                    <Button variant="contained" color="primary" onClick={send} sx={{ marginLeft: 2 }}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Web;
