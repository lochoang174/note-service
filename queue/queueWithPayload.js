const amqplib = require('amqplib');

const amqp_url_docker = 'amqp://rabbitmq:5672';

const sendQueueWithPayload = async ({  email, noteId, ownerId }) => {
  try {
    // 1. Tạo kết nối
    const conn = await amqplib.connect(amqp_url_docker);

    // 2. Tạo channel
    const channel = await conn.createChannel();

    // 3. Đặt tên queue
    const nameQueue = 'invite_queue';

    // 4. Tạo queue
    await channel.assertQueue(nameQueue, {
      durable: false
    });

    // 5. Tạo payload với đầy đủ thông tin
    const payload = {
      email: email,
      noteId: noteId,
      ownerId:ownerId
    };

    // 6. Gửi payload vào queue
    await channel.sendToQueue(nameQueue, Buffer.from(JSON.stringify(payload)));
    console.log('Đã gửi message thành công:', payload);

    // 7. Đóng kết nối
    await channel.close();
    await conn.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ví dụ sử dụng
// sendQueueWithPayload({ 
//   msg: 'Nội dung tin nhắn mới', 
//   userId: 'user123', 
//   noteId: 'note456' 
// }); 
module.exports = {
  sendQueueWithPayload
}