const PendingAcceptedCancellationsModel = require("../../models/pendingAcceptedCancellationsModel");
const ProviderAIController = require("./providerAIController");

exports.addNewCancelledBooking = async (req, res) => {
  try {
    const { booking_id, reason, provider } = req.body;
    const result =
      await PendingAcceptedCancellationsModel.addNewCancelledBooking(
        booking_id,
        reason,
        provider,
      );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error add new cell in cancellation bookings",
      error: err.message,
    });
  }
};

exports.updateBookStatus = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const result =
      await PendingAcceptedCancellationsModel.updateBookStatus(booking_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error update book status",
      error: err.message,
    });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const { book, provider } = req.body;
    const result = await PendingAcceptedCancellationsModel.addNotification(
      book,
      provider,
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error add new cell in Notifications",
      error: err.message,
    });
  }
};

exports.automaticBookUsingAI = async (req, res) => {
  try {
    const { book } = req.body;
    let data = {};
    data.cancelledBook = book;

    const serviceProviderTable =
      await PendingAcceptedCancellationsModel.getServiceProviderTable(
        book.provider_id,
      );
    data.serviceProviderTable = serviceProviderTable;

    //////////////////////
    const services = await PendingAcceptedCancellationsModel.getAllServices();
    data.services = services;
    /////////////////////////
    const providers = await PendingAcceptedCancellationsModel.getProviders(
      book.provider_id,
    );
    data.providers = providers;

    ///////////////////
    const providersSchedules =
      await PendingAcceptedCancellationsModel.getProvidersSchedules(
        book.provider_id,
      );
    data.providersSchedules = providersSchedules;
    //////////////

    const providersHolidays =
      await PendingAcceptedCancellationsModel.getProvidersHolidays(
        book.provider_id,
      );
    data.providersHolidays = providersHolidays;
    ///////////////////

    const providersBookings =
      await PendingAcceptedCancellationsModel.getProvidersBookings(
        book.provider_id,
      );
    data.providersBookings = providersBookings;
    //data from DB is ready

    const resultFromAI = await ProviderAIController.findBestProvider(data);
    console.log("resultFromAI: ", resultFromAI);

    if (resultFromAI.found) {
      //store the book and book answers and notifications
      const resultNewBook = await PendingAcceptedCancellationsModel.addNewBook(
        book,
        resultFromAI,
      );
      await PendingAcceptedCancellationsModel.addNewNotificationToUser(
        resultFromAI,
        book.customerId,
      );
      await PendingAcceptedCancellationsModel.addBookAnswers(
        book.booking_id,
        resultNewBook.booking_id,
      );

      res.json({
        success: `The system is Automatically Book the service for the user, with 
        ${resultFromAI.best_provider.provider_name}, with service name: ${resultFromAI.best_provider.service_name_offered_by_provider}
        with ${resultFromAI.best_provider.base_price}/hr.`,
      });
    } else {
      res.json({ error: resultFromAI.reason });
    }
  } catch (err) {
    res.json({ error: "Can't do auto booking" });
  }
};

exports.sendFailureNotificationToUser = async (req, res) => {
  try {
    const { book, provider } = req.body;
    const result =
      await PendingAcceptedCancellationsModel.sendFailureNotificationToUser(
        book,
        provider,
      );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message:
        "Error add new cell in Notifications for user for system can't book for him",
      error: err.message,
    });
  }
};
