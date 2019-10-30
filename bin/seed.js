require('dotenv').config()
const mongoose = require('mongoose');
const Die = require('../models/Die');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: '${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const dice = [
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366226/cubee/dice/47_o8amut.svg',
    tags: ['Standard', 'Test']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366227/cubee/dice/51_yz1sfd.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366227/cubee/dice/52_qxj2wq.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366227/cubee/dice/49_vdnelq.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366227/cubee/dice/48_iy2ckt.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366227/cubee/dice/53_uz8eqq.png',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366225/cubee/dice/87_nyxgws.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366227/cubee/dice/50_x0v4pi.png',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366225/cubee/dice/45_wlwtyb.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366225/cubee/dice/46_wrrxbh.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366225/cubee/dice/44_s23mmp.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366224/cubee/dice/85_ad4an8.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366224/cubee/dice/86_yfutnr.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366223/cubee/dice/81_mxm8tl.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366223/cubee/dice/80_fba5ym.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366223/cubee/dice/84_g06egm.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366223/cubee/dice/83_byd1xp.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366223/cubee/dice/82_a90si9.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366222/cubee/dice/79_vdrup4.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366220/cubee/dice/76_qk6vcg.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366221/cubee/dice/78_ibdglh.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366221/cubee/dice/77_xpshrk.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366221/cubee/dice/75_puw5zt.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366220/cubee/dice/74_jp89nh.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366220/cubee/dice/73_mg3ccx.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366219/cubee/dice/69_akovwa.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366219/cubee/dice/70_t60d3b.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366219/cubee/dice/71_u0p9qv.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366218/cubee/dice/66_hwpkvi.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366220/cubee/dice/72_szta93.png',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366217/cubee/dice/61_icgo2d.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366218/cubee/dice/67_rknl7b.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366218/cubee/dice/65_ap73s0.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366219/cubee/dice/68_q563du.png',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366217/cubee/dice/62_r5tunp.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366217/cubee/dice/63_sqoheb.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366216/cubee/dice/56_ax1wk7.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366216/cubee/dice/60_bvrevd.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366217/cubee/dice/64_fn6d2c.png',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366216/cubee/dice/59_abhybr.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366216/cubee/dice/55_ekzwzv.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366216/cubee/dice/57_ufzo4e.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366216/cubee/dice/54_lxyf9t.svg',
    tags: ['Standard']
  },
  {
    name: 'Standard Die',
    icon: 'https://res.cloudinary.com/fx2000/image/upload/v1572366216/cubee/dice/58_dibdn3.png',
    tags: ['Standard']
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
