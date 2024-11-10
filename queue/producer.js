const amqplib = require('amqplib');

const amqp_url_docker = 'amqp://rabbitmq:5672'; // Add your Docker URL if needed

const sendQueue = async ({ msg }) => {
  try {
    // 1. Create connection
    const conn = await amqplib.connect(amqp_url_docker);

    // 2. Create channel
    const channel = await conn.createChannel();

    // 3. Create name queue
    const nameQueue = 'q1';

    // 4. Create queue
    await channel.assertQueue(nameQueue, {
      durable: false
    });

    // 5. Send to queue
    await channel.sendToQueue(nameQueue, Buffer.from(msg));

    // 6. Close connection and channel
    await channel.close();
    await conn.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

sendQueue({ msg: '999' });