const amqplib = require('amqplib');
const Note = require('../models/Note');
const Sharing = require('../models/Sharing');
const amqp_url_docker = 'amqp://rabbitmq:5672';  // Use the correct RabbitMQ container hostname

const receiveQueue = async () => {
  try {
    const conn = await amqplib.connect(amqp_url_docker);

    const channel = await conn.createChannel();

    const signupQueue = 'signup_queue';
    const acceptQueue = 'accept_queue';

    // Assert the queues
    await channel.assertQueue(signupQueue, { durable: false });
    // await channel.assertQueue(acceptQueue, { durable: false });
    await channel.assertQueue(acceptQueue, { durable: false });
    channel.consume(acceptQueue, async (msg) => {
      if (msg !== null) {
        console.log("Received message from accept_queue:", msg.content.toString());
        
        try {
          const data = JSON.parse(msg.content.toString());
          const { userId, noteId } = data;
          
          Sharing.updateOne({ account: userId }, { $push: { noteId: noteId } });          
          // You can now use userId and noteId for further processing
          
        } catch (err) {
          console.error('Error processing accept message:', err);
        }
      }
    }, { noAck: true });

    // Consume from signup queue
    channel.consume(signupQueue, async (msg) => {
      if (msg !== null) {
        console.log("Received message from signup_queue:", msg.content.toString());

        const userId = msg.content.toString(); // assuming payload is a string (you can adjust according to actual payload structure)
        
        try {
          // Create Notes for user
          await Note.create({ title: 'test', content: 'test', owner: userId, status: '0' });
          await Note.create({ title: 'test', content: 'test', owner: userId, status: '1' });
          await Note.create({ title: 'test', content: 'test', owner: userId, status: '2' });

          // Create Sharing
          await Sharing.create({ account: userId, noteId: [] });

          console.log('Note and Sharing created successfully for user:', userId);
          
          // Acknowledge the message
        } catch (err) {
          console.error('Error processing message:', err);
          // If you don't want to ack on failure, you can nack or requeue
        }
      }
    }, { noAck: true });

    console.log('Waiting for messages...');
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = receiveQueue;
