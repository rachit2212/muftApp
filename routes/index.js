const express = require('express')
    , router = express.Router()
    ;

function loadRoutes(cfg) {

   let adminRoutes = require('./adminRoutes')(cfg);
   let customerRoutes = require('./customerRoutes')(cfg);
   let commonRoutes = require('./commonRoutes')(cfg);
   router.use('/admin', adminRoutes);
   router.use('/customer', customerRoutes);
   router.use('/common', commonRoutes);
}

module.exports = (cfg) => {
   if (typeof cfg === 'undefined') {
      throw new Error('No config object passed to router.');
   } else if (typeof cfg.models === 'undefined') {
      throw new Error('No models passed to router.');
   } else if (typeof cfg.config === 'undefined') {
      throw new Error('No config passed to router.');
   }

   loadRoutes(cfg);
   return router;
};
