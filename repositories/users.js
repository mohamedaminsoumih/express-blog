const { User } = require('../models')
module.exports = {
    getAllUsers() {
        return User.findAll()
    },
    // méthodes à implémenter
    async getUsers(offset = 0, limit = 10) {
        const users = await User.findAll({ offset, limit });
        const count = await User.count({});
        return { users, count }
    },
    getAdmins() {
        return User.findAll({ where: { role: 'admin' } })
    },
    getAuthors() {
        return User.findAll({ where: { role: 'author' } })
    },
    getGuests() {
        return User.findAll({ where: { role: 'guest' } })

    },
    getUser(id) {
        return User.findOne({ where: { id } })
    },
    getUserByEmail(email) {
        return User.findOne({ where: { email } })

    },
    addUser(user) {
        return User.create({
            email: user.email,
            username: user.username,
            password: user.password,
            role: user.role,
        })
    },
    updateUser(user) {
        return User.update(user, {
            where: {
                id: user.id
            }
        })
    },
    deleteUser(id) {
        return User.destroy({
            where: {
                id
            }
        })
    },
    // D'autres méthodes jugées utiles
}