const mongoose = require('mongoose');
const Die = require('../models/Die');

const dbtitle = 'cubee';

mongoose.connect(`mongodb://localhost/${dbtitle}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  keepAlive: true
});

const dice = [
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348507/cubee/dice/050_hre9y8.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348504/cubee/dice/047_ljorvk.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348506/cubee/dice/049_ki83wx.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348505/cubee/dice/035_sutxst.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348505/cubee/dice/048_ufr5a9.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348505/cubee/dice/046_wdqydm.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348505/cubee/dice/044_jq5cyc.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348505/cubee/dice/034_kkquh9.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348504/cubee/dice/045_nm4t1w.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348503/cubee/dice/043_iohr3b.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348503/cubee/dice/041_iyzo6w.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348503/cubee/dice/042_zekudj.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348501/cubee/dice/036_iadype.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348501/cubee/dice/038_ogzggg.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348501/cubee/dice/031_skgpgf.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348499/cubee/dice/037_wdzifs.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348498/cubee/dice/040_hh0jap.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348496/cubee/dice/039_gah7zk.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348495/cubee/dice/028_lw1cse.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348495/cubee/dice/033_x1lubd.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348498/cubee/dice/032_wtkvbp.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348494/cubee/dice/029_gqgxil.png',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572348493/cubee/dice/026_hukntk.png',
    tags: ['Standard', 'Test']
  }
];

const createDice = (dice) => {
  dice.map(die => {
    const newDie = new Die(die);
    return newDie.save()
      .then(die => {
        console.log('Die created correctly: ', die);
        mongoose.connection.close();
      })
      .catch(error => {
        console.log('Impossible to add the die: ', error);
      });
  });
};

createDice(dice);
