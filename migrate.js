const db = require('./models')
async function migrate() {
    await db.sequelize.sync({ force: true })
}
migrate()