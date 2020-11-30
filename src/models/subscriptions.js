const { Model } = require('sequelize');
const sequelize = require('../helpers/dbConnection');
const { emailSubscriptionsSchema } = require('./schemas');

class EmailSubscribers extends Model {
	static async subscribeWebsite(email) {
		const getEmail = await this.findOne({ where: { email } })
		if (!getEmail) {
			return this.create({
				email,
				subscription_date: new Date(),
			})
		}
		return this.update({ subscription_date: new Date() }, { where: { email } });
	}

	static getEmail(email) {
		return this.findOne({ where: { email } });
	}

	static unsubscribeWebsite(email) {
		return this.update({ subscription_date: null }, { where: { email } });
	}
}

EmailSubscribers.init(emailSubscriptionsSchema, {
	sequelize,
	modelName: 'email_subscriptions',
});

module.exports = EmailSubscribers;
