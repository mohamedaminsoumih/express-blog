const router = require('express').Router();
const usersRepo = require('../repositories/users')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const { offset, limit } = req.query;
  res.send(await usersRepo.getUsers(parseInt(offset), parseInt(limit)))
});

/* Get user by id */
router.get('/:id', async function (req, res, next) {
  const { id } = req.params;
  res.send(await usersRepo.getUser(id))
});

/* Create a new user */
router.post('/', async function (req, res, next) {
  const user = req.body;
  console.log(user);
  res.send(await usersRepo.addUser(user))
});

/* Update a user */
router.put('/', async function (req, res, next) {
  const user = req.body;
  res.send(await usersRepo.updateUser(user))
});

/* Delete a user */
router.delete('/:id', async function (req, res, next) {
  const { id } = req.params;
  await usersRepo.deleteUser(id);
  res.sendStatus(200)
});

module.exports = router;