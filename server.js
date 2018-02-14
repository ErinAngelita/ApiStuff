import express from 'express';
import bodyParser from 'body-parser';
const app = express();
import mongoose from 'mongoose';
import Bear from './public/bear.js';

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
const router = express.Router();

router.use((req, res, next) => {
  console.log('Something is happening.');
  next();
});

mongoose.connect('mongodb://localhost/bears');
router.route('/bears')
  .post(({body}, res) => {
    const bear = new Bear();
    bear.name = body.name;
    bear.save(err => {
      if(err)
        res.send(err);
      res.json({message: 'Bear created!'});
    });
  })
  .get((req, res) => {
    Bear.find((err, bears) => {
      if (err)
        res.send(err);
      res.json(bears);
    });
  });
router.route('/bears/:bear_id')
  .get(({params}, res) => {
    Bear.findById(params.bear_id, (err, bear) => {
      if(err)
        res.send(err);
      res.json(bear);
    });
  })
  .put(({params, body}, res) => {
    Bear.findById(params.bear_id, (err, bear) => {
      if (err)
        res.send(err);
      bear.name = body.name;
      bear.save(err => {
        if (err)
          res.send(err);
        res.json({message: 'Bear updated!'});
      });
    });
  })
  .delete(({params}, res) => {
    Bear.remove( {
      _id: params.bear_id
    }, (err, bear) => {
      if (err)
        res.send(err);
      res.json({ message: 'Successfully deleted'});
    });
  });
router.get('/', (req, res) => {
  res.json({message: 'horray! welcome to our api!'
  });
});
app.use('/api', router);
app.listen(port);
console.log(`Magic happens on port ${port}`);
