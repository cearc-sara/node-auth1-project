
exports.seed = function(knex) {
  const users = [
    {
      username: '',
      password: ''
    },
    {
     username: '',
     password: ''
   },
   {
     username: '',
     password: ''
   }
  ]
  return knex("users").insert(users)
};
