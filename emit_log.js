var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'logs';
        var msg = process.argv.slice(2).join(' ') || 'Hello World!';

        channel.assertExchange(exchange, 'fanout', {
            durable: true
        });

        //var qname="fanout_q"
        var qname='producer';
        channel.assertQueue('fanout_q', {
            durable:true
          }, function(error2, q) {
            if (error2) {
              throw error2;
            }
            console.log(q);
            //channel.bindQueue(q.queue, exchange, '');  //third argument is binding key which is not required in fanout exchange as we are publishing on all queues.
      
            channel.publish(exchange, '', Buffer.from(msg),{
                persistent:true
            }); //second argument is routing key which is not required in fanout exchange
          });
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});