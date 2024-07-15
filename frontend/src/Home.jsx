import { useState } from "react";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Container, Typography, Box } from "@mui/material";
import { backend } from "./Constants";

function Home() {
    const [userid, setUserid] = useState("");
    const [gender, setGender] = useState("");
    const [about, setAbout] = useState("");
    const [age, setAge] = useState(0);

    function enter() {
        let par = `?user_id=${userid}&gender=${gender}&age=${age}&about=${about}`;
        fetch(backend + "/check" + par)
            .then(res => {
                if (res.status === 200) {
                    window.location.href = "/web" + par;
                } else {
                    alert("User ID already exists");
                }
            });
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gchat
                </Typography>
                <TextField
                    label="User ID"
                    variant="outlined"
                    fullWidth
                    onChange={e => setUserid(e.target.value)}
                    autoComplete="off"
                />
                <TextField
                    label="Age"
                    type="number"
                    variant="outlined"
                    fullWidth
                    onChange={e => setAge(e.target.value)}
                    autoComplete="off"
                />
                <TextField
                    label="About Me"
                    variant="outlined"
                    fullWidth
                    onChange={e => setAbout(e.target.value)}
                    autoComplete="off"
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        label="Gender"
                    >
                        <MenuItem value="">
                            <em>Choose gender</em>
                        </MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={enter}>
                    Enter Gchat
                </Button>
            </Box>
        </Container>
    );
}

export default Home;
