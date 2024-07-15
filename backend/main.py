from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
connections = {}
users = {}

@app.get("/check",status_code=200)
def check(user_id:str,gender:str,age:int,about:str):
    if user_id not in connections:
        return {"detail":"valid user id"}
    else:
        raise HTTPException(406,detail="user id already exists")

async def userdata():
    for ids,con in connections.items():
        await con.send_json({"from":"server","users":users})

@app.websocket("/connect")
async def websocket_endpoint(websocket:WebSocket,user_id:str,gender:str,age:int,about:str):
    await websocket.accept()
    connections[user_id]=websocket
    users[user_id]={"gender":gender,"age":age,"about":about}
    print(f"user {user_id} connected")
    await userdata()
    try:
        while True:
            data = await websocket.receive_json()
            if data["to"] in connections:
                await connections[data["to"]].send_json({"from":data["from"],"to":data["to"],"message":data["message"]})
    except WebSocketDisconnect:
        print(f"user {user_id} disconnected")
        if user_id in connections:
            del connections[user_id]
            del users[user_id]
        await userdata()        
		
