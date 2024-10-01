module.exports = new Proxy(
   {},
   {
     get: (target, property) => () => ({
       $$typeof: Symbol.for('react.element'),
       type: property,
       props: {},
     }),
   }
 );