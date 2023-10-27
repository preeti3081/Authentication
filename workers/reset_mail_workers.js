const queue = require('../config/kue');
const resetMailer = require('../mailers/reset_pass');
// process the mail of the queue
queue.process('reset', function(job, done){

    resetMailer.newmail(job.data);

    done();
})
