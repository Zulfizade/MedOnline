

export const socketHandler = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Yeni kullanıcı bağlandı: ${socket.id}`);

    socket.on('userConnected', ({ userId }) => {
      if (!userId) return;

      socket.userId = userId;

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, []);
      }
      onlineUsers.get(userId).push(socket.id);

      console.log(`✅ Kullanıcı bağlandı: ${userId}`);
      console.log('🌐 Şu anki online kullanıcılar:', Object.fromEntries(onlineUsers));
    });

    socket.on('sendMessage', async (data) => {
      const { receiverId, message } = data;

      if (!receiverId || !message) {
        console.warn('⚠️ Eksik veri: receiverId veya message yok');
        return;
      }

      console.log(`📤 Mesaj gönderiliyor. Alıcı: ${receiverId}, Mesaj: "${message}"`);

      const receiverSockets = onlineUsers.get(receiverId);

      if (receiverSockets?.length > 0) {
        console.log(`🟢 [${receiverId}] ONLINE sayıldı, socketler:`, receiverSockets);
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit('receiveMessage', data);
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Kullanıcı bağlantıyı kesti: ${socket.id}`);

      for (const [userId, socketIds] of onlineUsers.entries()) {
        const index = socketIds.indexOf(socket.id);
        if (index !== -1) {
          socketIds.splice(index, 1);
          if (socketIds.length === 0) {
            onlineUsers.delete(userId);
          } else {
            onlineUsers.set(userId, socketIds);
          }
          break;
        }
      }

      console.log('🔁 Güncel online kullanıcılar listesi:', Object.fromEntries(onlineUsers));
    });
  });
};
