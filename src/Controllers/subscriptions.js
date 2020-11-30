const websiteSubscriberModel = require('../models/subscriptions');
const { NotFoundError, InternalError } = require('../middlewares/errors');

class Subscriber {
  static async subscribeWebsite(email) {
    const newSubscriber = await websiteSubscriberModel.subscribeWebsite(email);

    if (!newSubscriber || newSubscriber.length <= 0) {
      throw new InternalError('Failed to subscribe');
    }

    return newSubscriber;
  }

  static async unsubscribeWebsite(email) {
    const getEmail = await websiteSubscriberModel.getEmail(email);
    if (!getEmail) {
      throw new NotFoundError('The user have not subscribed yet');
    }

    const unSubscriber = await websiteSubscriberModel.unsubscribeWebsite(getEmail.dataValues.email);

    if (!unSubscriber || unSubscriber.length <= 0) {
      throw new InternalError('Failed to unsubscribe');
    }

    return unSubscriber;
  }
}

module.exports = Subscriber;
