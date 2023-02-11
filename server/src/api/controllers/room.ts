import { SocketController, ConnectedSocket, MessageBody, OnMessage, SocketIO } from 'socket-controllers';
import { Socket, Server } from "socket.io"


@SocketController()
export class RoomController {

    @OnMessage('join')
    public async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: any, @SocketIO() io: Server) {

        // get the room
        const room = io.sockets.adapter.rooms.get(data.room);
        const socketRoomsFilter = Array.from(socket.rooms.values()).filter(
            (r) => r !== socket.id
          );

        // if the room doesn't exist, create it
         if(socketRoomsFilter.length>0 || (room && room.size === 2)) {
            socket.emit('room_join_error', {
                error: 'Unfortunately this Room is full :('
            });
            console.log('room full', data.room)
        }

         // if the room exists, and members less than 2
         else  {
            console.log("Inside jfklsdjfd jdjd")

          if(!room)
          {
            socket.join(data.room);
            socket.emit('joined', data.room);
            console.log("Inside jfklsdjfd",socket.id)
          }

            else if(room.size === 1)
            {
                socket.join(data.room);
                socket.emit("start_game", { start: true, symbol: "x" });
                socket.emit('joined', data.room);

            }

              else if(room.size > 1) {
                console.log("Inside",room.size)
                socket.to(data.room).emit("start_game", { start: false, symbol: "o" });
                // send to the second  client
                socket.emit("start_game", { start: true, symbol: "x" });

            }
        }


    }

    //leaving
    @OnMessage('leave')
    public async leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: any, @SocketIO() io: Server) {
        console.log('leave room', data);

        // delete room
        const room = io.sockets.adapter.rooms.get(data.room);

        console.log('leaved room', data.room);

        if(room && room.size === 1) {
            socket.leave(data.room);
        }
        else {
            socket.leave(data.room);
            socket.to(
                data.room
            ).emit('left', data.room);
        }
    }
}