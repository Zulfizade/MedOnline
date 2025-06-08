export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Yeni kullanıcı bağlandı:', socket.id);

    socket.on('sendMessage', (data) => {
      io.to(data.receiverId).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('Kullanıcı ayrıldı:', socket.id);
    });
  });
};
