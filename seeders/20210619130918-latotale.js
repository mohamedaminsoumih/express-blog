'use strict';
const faker = require('faker');
const { User, Tag, Article } = require('../models')

// Create new user
const createNewUser = (year) => {
  const email = faker.unique(() => faker.internet.email())
  const username = faker.unique(() => faker.internet.userName());
  const password = faker.internet.password();
  const createdAt = new Date(faker.date.between(new Date(year, 1), new Date(year, 5)).toString());
  return { email, username, password, role: "author", createdAt, updatedAt: createdAt }
}

// Generate count*user
const generatesUsers = (count) => new Array(count).fill(0).map((_, idx) => createNewUser(2000 + idx + 1));

// Create new tag
const createNewTag = () => ({ name: faker.unique(() => `${faker.lorem.word(10)} ${faker.lorem.word(10)} ${faker.lorem.word(10)}`) })

// Generate count*tags
const generatesTags = (count) => new Array(count).fill(0).map(_ => createNewTag());

// Create (min, max)*articles for a specific user
const createNewArticles = (user, min = 2, max = 10) => {
  // Determine number of articles to create
  const numberOfArticles = faker.datatype.number({ max, min })

  // Date creation of the user
  const userCreationDate = new Date(user.createdAt);

  // date creation to the article should be created at 
  const afterUserCreationDate = userCreationDate;
  afterUserCreationDate.setDate(afterUserCreationDate.getDate() + 1)

  // make sure that creation date of articles is after the user creation
  const createdAt = faker.date.between(userCreationDate, afterUserCreationDate);

  // return numberOfArticles*articles
  return new Array(numberOfArticles).fill(0).map(_ => ({
    userId: user.id,
    title: faker.unique(() => faker.lorem.sentence()),
    content: faker.lorem.paragraph(3),
    createdAt,
    updatedAt: createdAt
  }))
};

const tagArticle = async (min = 2, max = 6) => {
  // Determine number of tags to create
  const numberOfTags = faker.datatype.number({ max, min });

  // get numberOfTags*tags from db
  return await Tag.findAll({ limit: numberOfTags });

}

const createComments = (ArticleId, min = 0, max = 10) => {
  // Determine number of comments to create for an article with id=articleId
  const numberOfComments = faker.datatype.number({ max, min });
  const comments = new Array(numberOfComments).fill(0).map(_ => ({ content: faker.lorem.paragraph(3), ArticleId }));
  return comments;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate 20 users
    const users = generatesUsers(20);

    // Persist 20 users in the database; 
    await queryInterface.bulkInsert('Users', users);

    // Generate 10 tags
    const tags = generatesTags(10);

    // Persist 10 tags in the databse
    await queryInterface.bulkInsert('Tags', tags);

    // Get list of users from database
    const dbUsers = await User.findAll({ attributes: ['id', 'createdAt'] });
    for (let index = 0; index < dbUsers.length && dbUsers.length == 20; index++)
    {
      const { id, createdAt } = dbUsers[index];
      await queryInterface.bulkInsert('Articles', createNewArticles({ id, createdAt }));
    }

    // Tag Articles
    const articles = await Article.findAll();
    for (let index = 0; index < articles.length; index++)
    {
      const article = articles[index];

      const tags = await tagArticle();

      await article.addTags(tags);

      await queryInterface.bulkInsert('Comments', createComments(article.id))
    }


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
